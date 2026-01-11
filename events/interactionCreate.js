const {
    EmbedBuilder,
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    InteractionType,
    MessageFlags
} = require('discord.js');
const { getGender } = require('gender-detection-from-name');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client, validNames) {
        if (interaction.isButton()) {
            if (interaction.customId === 'startRegistration') {
                const modal = new ModalBuilder()
                    .setCustomId('registerModal')
                    .setTitle('Sunucu Kayıt Sistemi');

                const nameInput = new TextInputBuilder()
                    .setCustomId('regName')
                    .setLabel('İsminiz')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Örn: Ahmet')
                    .setRequired(true);

                const ageInput = new TextInputBuilder()
                    .setCustomId('regAge')
                    .setLabel('Yaşınız')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Örn: 20')
                    .setRequired(true);

                const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
                const secondActionRow = new ActionRowBuilder().addComponents(ageInput);

                modal.addComponents(firstActionRow, secondActionRow);

                await interaction.showModal(modal);
            }
        }

        if (interaction.type === InteractionType.ModalSubmit) {
            if (interaction.customId === 'registerModal') {
                const name = interaction.fields.getTextInputValue('regName').trim();
                const ageInput = interaction.fields.getTextInputValue('regAge').trim();

                const nameRegex = /^[a-zA-ZÇŞĞÜÖİçşğüöı ]{3,30}$/;
                if (!nameRegex.test(name)) {
                    return interaction.reply({
                        content: '❌ **Hatalı İsim:** İsim en az 3 karakterden oluşmalı ve sadece harf içermelidir.',
                        flags: [MessageFlags.Ephemeral]
                    });
                }

                const age = parseInt(ageInput);
                if (isNaN(age) || age < 10 || age > 60) {
                    return interaction.reply({
                        content: '❌ **Hatalı Yaş:** Lütfen geçerli bir yaş girin (10 - 60 arası).',
                        flags: [MessageFlags.Ephemeral]
                    });
                }

                await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

                if (!validNames.has(name.toUpperCase())) {
                    const logChannelId = process.env.LOG_CHANNEL_ID;
                    const logChannel = interaction.guild.channels.cache.get(logChannelId);
                    const staffRoleId = process.env.STAFF_ROLE_ID;

                    if (logChannel) {
                        const failEmbed = new EmbedBuilder()
                            .setTitle('⚠️ İsim Doğrulanamadı')
                            .setColor(0xe67e22)
                            .setDescription(`<@${interaction.user.id}> geçersiz bir isimle kayıt olmaya çalıştı: **${name}**\n\nBu kullanıcı için manuel kayıt gerekiyor.`)
                            .addFields(
                                { name: 'Girilen İsim', value: name, inline: true },
                                { name: 'Girilen Yaş', value: ageInput, inline: true }
                            )
                            .setTimestamp();

                        await logChannel.send({
                            content: staffRoleId ? `<@&${staffRoleId}>` : '',
                            embeds: [failEmbed]
                        });
                    }

                    return interaction.editReply({
                        content: '⚠️ **İsim Doğrulanamadı:** Girdiğiniz isim sistemimizde kayıtlı değil. Yetkililerimiz başvurunuzu inceleyip onaylayacaktır. Lütfen bekleyin.'
                    });
                }

                try {
                    const gender = getGender(name, 'tr');

                    let roleId;
                    let genderText;

                    if (gender === 'male') {
                        roleId = process.env.MALE_ROLE_ID;
                        genderText = 'Erkek';
                    } else if (gender === 'female') {
                        roleId = process.env.FEMALE_ROLE_ID;
                        genderText = 'Kız';
                    } else {
                        roleId = process.env.MALE_ROLE_ID;
                        genderText = 'Belirlenemedi (Varsayılan: Erkek)';
                    }

                    const member = interaction.member;
                    const guild = interaction.guild;

                    await member.setNickname(`${name} | ${age}`).catch(e => console.error("Nickname error:", e));

                    const unregisteredRoleId = process.env.UNREGISTERED_ROLE_ID;
                    if (unregisteredRoleId) await member.roles.remove(unregisteredRoleId).catch(e => console.error("Role remove error:", e));

                    const targetRole = guild.roles.cache.get(roleId);
                    if (targetRole) {
                        await member.roles.add(targetRole).catch(e => console.error("Role add error:", e));
                    }

                    const resultEmbed = new EmbedBuilder()
                        .setTitle('Kayıt Başarılı!')
                        .setColor(gender === 'male' ? 0x3498db : 0xe91e63)
                        .setDescription(`Sunucumuza hoş geldin, **${name}**!`)
                        .addFields(
                            { name: 'İsim', value: name, inline: true },
                            { name: 'Yaş', value: ageInput, inline: true },
                            { name: 'Cinsiyet', value: genderText, inline: true }
                        )
                        .setTimestamp();

                    await interaction.editReply({ embeds: [resultEmbed] });

                    // Registration Log
                    const logChannelId = process.env.LOG_CHANNEL_ID;
                    const logChannel = guild.channels.cache.get(logChannelId);
                    if (logChannel) {
                        const logEmbed = new EmbedBuilder()
                            .setTitle('Yeni Kayıt İşlemi')
                            .setColor(0x2ecc71)
                            .setThumbnail(member.user.displayAvatarURL())
                            .addFields(
                                { name: 'Kullanıcı', value: `<@${member.id}> (${member.id})`, inline: false },
                                { name: 'İsim / Yaş', value: `${name} | ${age}`, inline: true },
                                { name: 'Tahmin Edilen Cinsiyet', value: genderText, inline: true }
                            )
                            .setFooter({ text: 'Kayıt Otomatik Olarak Yapıldı' })
                            .setTimestamp();

                        await logChannel.send({ embeds: [logEmbed] });
                    }

                } catch (error) {
                    console.error(error);
                    await interaction.editReply({ content: 'Kayıt sırasında bir hata oluştu!' });
                }
            }
        }
    }
};
