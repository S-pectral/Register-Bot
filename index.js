require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember]
});

let validNames = new Set();
try {
    const data = fs.readFileSync(path.join(__dirname, 'isimler.txt'), 'utf8');
    validNames = new Set(data.split(/\r?\n/).map(name => name.trim().toUpperCase()));
    console.log(`${validNames.size} isim başarıyla yüklendi.`);
} catch (error) {
    console.error("isimler.txt okunamadı:", error);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client, validNames));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client, validNames));
    }
}

client.login(process.env.TOKEN);
