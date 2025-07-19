// src/commands/slash/jornadas.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jornadas')
    .setDescription('Muestra el calendario de las jornadas de liga'),
  async execute(interaction) {
    const description = [
      'Fecha 1: La Isla',
      'Fecha 2: Los Tomasitos',
      'Fecha 3: U de Chile cc',
      'Fecha 4: Machukin (5‑1, 14‑4)',
      'Fecha 5: Los Pibes del Elbio (5‑3, 4‑3)',
      'Fecha 6: La Docta ESP',
      'Fecha 7: Joga Bonito',
      'Fecha 8: Coventry FGH (13‑2, 7‑0)',
      'Fecha 14: Wachines (4‑1, 6‑0)'
    ].join('\n');

    const embed = new EmbedBuilder()
      .setTitle('🗓️ Jornadas de Liga')
      .setDescription(description)
      .setColor('Green');

    await interaction.reply({ embeds: [embed] });
  }
};
    