const registerCommand = require('../commands/register.js');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        const prefix = process.env.PREFIX || '.';
        if (message.author.bot || !message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        await registerCommand.execute(message, args, client);
    }
};
