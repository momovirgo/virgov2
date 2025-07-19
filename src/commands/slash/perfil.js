// src/commands/slash/perfil.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const userMapping = require('../../utils/userMapping');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('Muestra tus estadísticas personales de la liga'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const playerName = userMapping[userId];

    if (!playerName) {
      return interaction.reply({
        content: '🚫 No estás vinculado a ningún jugador. Contactá con un admin para registrarte.',
        ephemeral: true
      });
    }

    // Ruta corregida al stats.json
    const statsPath = path.join(__dirname, '../../utils/data/stats.json');
    let stats;
    try {
      stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
    } catch (error) {
      console.error('Error leyendo stats.json:', error);
      return interaction.reply({ content: '❌ Error al leer los datos de los jugadores.', ephemeral: true });
    }

    const playerStats = stats.find(p => p.nombre.toLowerCase() === playerName.toLowerCase());
    if (!playerStats) {
      return interaction.reply({
        content: '📭 Todavía no hay estadísticas para vos.',
        ephemeral: true
      });
    }

    const ga = playerStats.goles + playerStats.asistencias;
    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle(`📊 Tu perfil: ${playerStats.nombre}`)
      .addFields(
        { name: '🎮 Personaje',      value: `\`${playerStats.console_tag}\``, inline: false },
        { name: '📅 Partidos',       value: `${playerStats.partidos}`,   inline: true },
        { name: '⚽ Goles',          value: `${playerStats.goles}`,      inline: true },
        { name: '🅰️ Asistencias',    value: `${playerStats.asistencias}`,inline: true },
        { name: '💥 G+A',            value: `${ga}`,                     inline: true }
      )
      .setFooter({ text: 'Virgo V2 • Liga' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
