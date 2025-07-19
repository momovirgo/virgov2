// src/commands/slash/jugador.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Igual apuntamos al JSON dentro de utils/data
const statsPath = path.join(__dirname, '../../utils/data/stats.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jugador')
    .setDescription('Muestra estadísticas de un jugador')
    .addStringOption(opt =>
      opt.setName('nombre')
         .setDescription('Nombre real del jugador (ej: cathy)')
         .setRequired(true)
    ),

  async execute(interaction) {
    const nombreBuscado = interaction.options.getString('nombre').toLowerCase();

    if (!fs.existsSync(statsPath)) {
      return interaction.reply({ content: '❌ No se encontró el archivo de estadísticas.', ephemeral: true });
    }

    const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
    const jugador = statsData.find(j => j.nombre.toLowerCase() === nombreBuscado);

    if (!jugador) {
      return interaction.reply({ content: '🚫 No encontré a ese jugador. Asegurate de que haya jugado partidos o esté actualizado.', ephemeral: true });
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

    await interaction.reply({ embeds: [embed] });
  }
};
