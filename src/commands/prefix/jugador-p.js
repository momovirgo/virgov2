// src/commands/prefix/jugador-p.js
const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

// Ahora apunta al data dentro de utils:
const statsPath = path.join(__dirname, '../../utils/data/stats.json');

module.exports = {
  name: 'jugador',
  async execute(message, args) {
    if (!args.length) {
      return message.reply('⚠️ Tenés que escribir el nombre real del jugador (ej: .jugador cathy).');
    }

    if (!fs.existsSync(statsPath)) {
      return message.reply('❌ No se encontró el archivo de estadísticas (revisá que stats.json esté en utils/data).');
    }

    const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
    const nombreBuscado = args.join(' ').toLowerCase();
    const jugador = statsData.find(j => j.nombre.toLowerCase() === nombreBuscado);

    if (!jugador) {
      return message.reply('🚫 No encontré a ese jugador. Asegurate de que haya jugado partidos o esté actualizado.');
    }

    const ga = jugador.goles + jugador.asistencias;
    const embed = new EmbedBuilder()
      .setColor(0x00c3ff)
      .setTitle(`📊 Estadísticas de ${jugador.nombre}`)
      .setDescription(`🎮 Personaje: \`${jugador.console_tag}\``)
      .addFields(
        { name: '📅 Partidos',      value: `${jugador.partidos}`,   inline: true },
        { name: '⚽ Goles',         value: `${jugador.goles}`,      inline: true },
        { name: '🅰️ Asistencias',   value: `${jugador.asistencias}`, inline: true },
        { name: '📈 G+A',           value: `${ga}`,                  inline: true },
      )
      .setFooter({ text: 'Virgo V2 • Stats de Liga' })
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }
};
