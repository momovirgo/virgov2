module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.slashCommands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({ content: '❌ Comando no encontrado.', ephemeral: true });
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error ejecutando el comando /${interaction.commandName}:`, error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '⚠️ Ocurrió un error al ejecutar este comando.', ephemeral: true });
      } else {
        await interaction.reply({ content: '⚠️ Error al ejecutar el comando.', ephemeral: true });
      }
    }
  }
};
