// src/utils/embedBuilder.js
const { EmbedBuilder } = require('discord.js');

/**
 * Construye el embed para el comando perfil
 * @param {GuildMember} member
 * @param {Object} stats
 */
function buildProfileEmbed(member, stats) {
  const embed = new EmbedBuilder()
    .setTitle(`${member.user.username}`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: 'Roles', value: member.roles.cache.map(r => r.name).join(', ') || 'Ninguno', inline: false },
      { name: 'Ingresó', value: new Date(member.joinedTimestamp).toLocaleDateString(), inline: true },
      { name: 'Partidos', value: `${stats?.partidos ?? 0}`, inline: true },
      { name: 'Goles', value: `${stats?.goles ?? 0}`, inline: true },
      { name: 'Asistencias', value: `${stats?.asistencias ?? 0}`, inline: true }
    );
  return embed;
}

/**
 * Construye el embed para el comando jugador
 * @param {Object} stats
 */
function buildPlayerEmbed(stats) {
  const embed = new EmbedBuilder()
    .setTitle(`${stats.nombre} (${stats.console_tag})`)
    .addFields(
      { name: 'Partidos', value: `${stats.partidos}`, inline: true },
      { name: 'Goles', value: `${stats.goles}`, inline: true },
      { name: 'Asistencias', value: `${stats.asistencias}`, inline: true },
      { name: 'Valoración Promedio', value: `${stats.promedio_valoracion.toFixed(1)}`, inline: true }
    );
  return embed;
}

module.exports = { buildProfileEmbed, buildPlayerEmbed };