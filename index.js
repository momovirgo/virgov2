// index.js
require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// --- Collections ---
client.commands = new Collection();       // para prefix
client.slashCommands = new Collection();  // para slash

const PREFIX = '.';

// --- Carga de comandos prefix ---
const prefixDir = path.join(__dirname, 'src', 'commands', 'prefix');
if (fs.existsSync(prefixDir)) {
  for (const file of fs.readdirSync(prefixDir).filter(f => f.endsWith('.js'))) {
    const cmd = require(path.join(prefixDir, file));
    // asumimos que exporta cmd.name y cmd.execute
    if (cmd.name && cmd.execute) {
      client.commands.set(cmd.name, cmd);
    }
  }
}

// --- Carga de comandos slash ---
const slashDir = path.join(__dirname, 'src', 'commands', 'slash');
const slashData = [];
if (fs.existsSync(slashDir)) {
  for (const file of fs.readdirSync(slashDir).filter(f => f.endsWith('.js'))) {
    const cmd = require(path.join(slashDir, file));
    if (cmd.data && cmd.execute) {
      client.slashCommands.set(cmd.data.name, cmd);
      slashData.push(cmd.data.toJSON());
    }
  }
}

const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('💚 Bot vivo'));
app.listen(3000, () => console.log('Webserver arriba en http://localhost:3000'));

// --- Registrar eventos ---
client.on(Events.MessageCreate, async message => {
  if (message.author.bot || !message.guild) return;
  if (!message.content.startsWith(PREFIX)) return;

  const [ cmdName, ...args ] = message.content
    .slice(PREFIX.length)
    .trim()
    .split(/\s+/);

  const command = client.commands.get(cmdName.toLowerCase());
  if (!command) return; 

  try {
    await command.execute(message, args);
  } catch (err) {
    console.error(`Error ejecutando prefix ${cmdName}:`, err);
    message.reply('❌ Ocurrió un error ejecutando ese comando.');
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.slashCommands.get(interaction.commandName);
  if (!command) {
    return interaction.reply({ content: '❌ Comando no encontrado.', ephemeral: true });
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`Error ejecutando slash /${interaction.commandName}:`, err);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '❌ Hubo un error.', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ Hubo un error.', ephemeral: true });
    }
  }
});

// --- Desplegar slash commands al iniciar ---
(async () => {
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  try {
    console.log('🔁 Registrando slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: slashData }
    );
    console.log('✅ Slash commands registrados.');
  } catch (error) {
    console.error('❌ Error registrando slash commands:', error);
  }
})();

// --- Login ---
client.login(process.env.TOKEN);
