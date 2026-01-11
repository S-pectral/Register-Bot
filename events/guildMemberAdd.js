const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
        const channel = member.guild.channels.cache.get(welcomeChannelId);

        if (!channel) return console.error("Welcome channel not found!");

        const embed = new EmbedBuilder()
            .setTitle(`${member.guild.name}'a Hoş Geldiniz!`)
            .setColor(0x2f3136)
            .setDescription(`<@${member.id}> Kayıt Bekleniyorsunuz. Kayıt işlemlerinin başlaması için aşağıdaki butona basmanız rica olunur.\n\n**Bilgilendirme:**\nSunucumuza kaydolmak için isim ve yaş girmeniz zorunludur. Kayıt işleminizi botumuz otomatik olarak isimden cinsiyet tespiti yaparak tamamlayacaktır.`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('startRegistration')
                    .setLabel('Kayıt Ol')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('📝')
            );

        await channel.send({
            content: `<@${member.id}> hoş geldin!`,
            embeds: [embed],
            components: [row]
        });
    }
};
