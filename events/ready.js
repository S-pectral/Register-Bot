const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    name: 'clientReady',
    once: true,
    async execute(client) {
        console.log(`Bot initialized as ${client.user.tag}`);

        const voiceChannelId = process.env.VOICE_CHANNEL_ID;
        const guildId = process.env.GUILD_ID;

        if (voiceChannelId && guildId) {
            try {
                joinVoiceChannel({
                    channelId: voiceChannelId,
                    guildId: guildId,
                    adapterCreator: client.guilds.cache.get(guildId).voiceAdapterCreator,
                    selfMute: true,
                    selfDeaf: true
                });
                console.log('Voice channel connected (Muted/Deafened).');
            } catch (error) {
                console.error('Voice connection error:', error);
            }
        }

        const updateStatus = async () => {
            const guildId = process.env.GUILD_ID;
            const guild = client.guilds.cache.get(guildId);

            if (guild) {
                const memberCount = guild.memberCount;
                const guildName = guild.name;
                client.user.setActivity(`${guildName} | ${memberCount} Üye`, {
                    type: 3 // Watching
                });
            }
        };

        updateStatus();
        setInterval(updateStatus, 100000); // 10 dakikada bir güncelle
    }
};
