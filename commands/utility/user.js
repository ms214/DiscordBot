const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('명령어를 실행한 유저의 정보'),
    async execute(interaction){
        await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}`);
    },
};