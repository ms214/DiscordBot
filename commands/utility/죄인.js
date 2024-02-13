const { SlashCommandBuilder, PermissionFlagsBits, GuildMemberManager, User, GuildMember, GuildMemberRoleManager} = require('discord.js');
const { 죄인ID } = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('죄인')
    .setDescription('죄인에 넣어둘 멤버와 시간 지정')
    .addUserOption(option=>
        option
            .setName('target')
            .setDescription('죄인에 넣을 사람')
            .setRequired(true))
    .addStringOption(option=>
        option
            .setName('time')
            .setDescription('죄인에 넣어둘 시간'))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction){
        const target = interaction.options.getUser('target');
        const time = interaction.options.getString('time') ?? '60';
        await interaction.reply(`Mute ${target.username} for ${time} minutes.`);
        //target을 죄인에 넣어두는 코드
        const chriminal_role = interaction.guild.roles.valueOf().find(x => x.name === "죄인");
        //const member = interaction.guild.members.valueOf().get(target.id);
        const member = await interaction.guild.members.fetch(target.id);
        console.log(member);
        member.roles.add(죄인ID);
        //member.addRole(chriminal_role);
        setTimeout(() => member.roles.remove(죄인ID) , time*1000*60);
        interaction.channel.send('<@'+target.id+'>'+'은(는) 죄인에서 풀려났습니다.');
    },
};