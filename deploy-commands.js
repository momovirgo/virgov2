// deploy-commands.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./src/config');

const commands = [];

// Ruta absoluta al directorio de comandos slash
const commandsPath = path.join(__dirname, 'src', 'commands', 'slash');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[ADVERTENCIA] El comando en ${filePath} no tiene una propiedad "data" o "execute".`);
  }
}

const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log(`📡 Registrando ${commands.length} comandos slash en Discord (Guild)...`);

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands },
    );

    console.log('✅ Comandos registrados exitosamente.');
  } catch (error) {
    console.error('❌ Error registrando comandos:', error);
  }
})();
