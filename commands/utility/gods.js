const { SlashCommandBuilder, PermissionFlagsBits, GuildMemberManager, User, GuildMember, GuildMemberRoleManager} = require('discord.js');
const {chriminal_main, chriminal_sub} = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('gods')
    .setDescription('그분곁으로 이동'),
    
    async execute(interaction){
        const member = await interaction.guild.members.fetch(interaction.user.id);
        if(!member.roles.valueOf().find(x=>x.name === '제인')){
            interaction.reply("명령어를 실행할 수 있는 권한이 없습니다.");
        }else{
            const channel = interaction.guild.channels.fetch();
            console.log(interaction);
            const voice = interaction.member.voice;
            voice.setChannel(chriminal_main);
            interaction.reply("그분의 곁에 있으세요.");
        }
    },
};