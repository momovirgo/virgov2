module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    const prefix = '.'; // Asegurate que este sea el prefix real
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = message.client.commands.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('❌ Hubo un error al ejecutar el comando.');
    }
  }
};
