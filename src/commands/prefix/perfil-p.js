// Archivo: src/commands/prefix/perfil-p.js

const stats = require('../../utils/data/stats.json');
const userMapping = require('../../utils/userMapping');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'perfil',
  async execute(message, args) {
    const userId = message.author.id;
    const playerName = userMapping[userId];

    if (!playerName) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Yellow')
            .setDescription('⚠️ No estás registrado en las estadísticas.')
        ]
      });
    }

    const player = stats.find(p => p.nombre.toLowerCase() === playerName.toLowerCase());

    if (!player) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription('❌ No se encontraron estadísticas tuyas. Aún no jugaste partidos o no estás actualizado.')
        ]
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(`📊 Tu perfil, ${player.nombre}`)
      .addFields(
        { name: '🎮 Personaje', value: `\`${player.console_tag}\``, inline: false },
        { name: '📅 Partidos', value: `${player.partidos}`, inline: true },
        { name: '⚽ Goles', value: `${player.goles}`, inline: true },
        { name: '🎯 Asistencias', value: `${player.asistencias}`, inline: true },
        { name: '📈 G+A', value: `${player.goles + player.asistencias}`, inline: true },
      )
      .setColor('Blue');

    return message.reply({ embeds: [embed] });
  }
};
