const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'registerCommands',
    execute: async (message, args, client) => {
        const command = message.content.slice(1).trim().split(/ +/)[0].toLowerCase();

        if (command === 'e' || command === 'k') {
            const staffRoleId = process.env.STAFF_ROLE_ID;
            if (staffRoleId && !message.member.roles.cache.has(staffRoleId)) {
                return message.reply('❌ Bu komutu kullanmak için yetkiniz yok.').then(m => setTimeout(() => m.delete(), 5000));
            }

            const targetMember = message.mentions.members.first();
            if (!targetMember) return message.reply('❌ Lütfen bir kullanıcı etiketleyin. Örn: `.e @Kullanıcı İsim Yaş`');

            const name = args[2];
            const age = args[3];

            if (!name || !age) return message.reply('❌ Eksik bilgi! Kullanım: `.e @Kullanıcı İsim Yaş`');

            try {
                const gender = command === 'e' ? 'male' : 'female';
                const genderText = gender === 'male' ? 'Erkek' : 'Kız';
                const roleId = gender === 'male' ? process.env.MALE_ROLE_ID : process.env.FEMALE_ROLE_ID;

                await targetMember.setNickname(`${name} | ${age}`).catch(e => console.error("Nick error:", e));

                const unregisteredRoleId = process.env.UNREGISTERED_ROLE_ID;
                if (unregisteredRoleId) await targetMember.roles.remove(unregisteredRoleId).catch(e => { });

                const targetRole = message.guild.roles.cache.get(roleId);
                if (targetRole) await targetMember.roles.add(targetRole);

                const embed = new EmbedBuilder()
                    .setTitle('Manuel Kayıt İşlemi')
                    .setColor(gender === 'male' ? 0x3498db : 0xe91e63)
                    .setDescription(`<@${targetMember.id}> kullanıcısı **${message.author.tag}** tarafından kaydedildi.`)
                    .addFields(
                        { name: 'İsim / Yaş', value: `${name} | ${age}`, inline: true },
                        { name: 'Cinsiyet', value: genderText, inline: true }
                    )
                    .setTimestamp();

                message.channel.send({ embeds: [embed] });

                const logChannelId = process.env.LOG_CHANNEL_ID;
                const logChannel = message.guild.channels.cache.get(logChannelId);
                if (logChannel) {
                    logChannel.send({ embeds: [embed.setTitle('Manuel Kayıt Log')] });
                }

            } catch (error) {
                console.error(error);
                message.reply('❌ Kayıt sırasında bir hata oluştu.');
            }
        }
    }
};
