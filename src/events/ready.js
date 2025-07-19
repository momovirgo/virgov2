// src/events/ready.js
const { Events, Collection } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Conectado como ${client.user.tag}`);
    // Configurar colección para slashCommands
    client.slashCommands = new Collection();
    // Cargar comandos slash en memoria
    const commandFiles = require('fs')
      .readdirSync(__dirname + '/../commands')
      .filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      if (command.data && command.execute) {
        client.slashCommands.set(command.data.name, command);
      }
    }
  },
};