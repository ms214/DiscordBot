const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

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
            .setDescription('죄인에 넣어둘 시간')),
    
    async execute(interaction){
        const admin = await interaction.guild.members.fetch(interaction.user.id);
        console.log(admin.roles.valueOf());
        if(admin.roles.valueOf().find(x=>x.name === 'admin')){
            const target = interaction.options.getUser('target');
            let time = interaction.options.getString('time') ?? '60';
            time *= 1;
            if(time < 0 || time > Number.MAX_SAFE_INTEGER) interaction.reply("잘못된 숫자가 입력되었습니다.");
            else if(isNaN(time)) interaction.reply("숫자를 입력해주세요");
            else{
                await interaction.reply('<@' + target.id + '>은(는) '+ time +'분 동안 죄인입니다.');
                //target을 죄인에 넣어두는 코드
                const member = await interaction.guild.members.fetch(target.id);
                const chriminal_role = await interaction.guild.roles.valueOf().find(x=>x.name=== '제인');
                console.log(member);
                member.roles.add(chriminal_role);
                setTimeout(()=>chriminal(member, interaction, target, chriminal_role), time*1000*60);
            }
        }else{
            interaction.reply('해당 명령어에 대한 권한이 없습니다.');
        }
    },
};

function chriminal(member, interaction, target, chriminal_role){
    member.roles.remove(chriminal_role);
    interaction.channel.send('<@'+target.id+'>'+'은(는) 죄인에서 풀려났습니다.');
}