const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

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
        const target = interaction.options.getUser('target');
        let time = interaction.options.getString('time') ?? '60';
        time *= 1;
        if(time < 0 || time > Number.MAX_SAFE_INTEGER) interaction.reply("잘못된 숫자가 입력되었습니다.");
        else if(isNaN(time)) interaction.reply("숫자를 입력해주세요");
        else{
            if(admin.roles.valueOf().find(x=>x.name === 'admin')){
                interaction.reply(`admin 권한으로 죄인을 적용합니다.`)
                
                addChriminal(interaction, target, time);
            }else{
                const embed = new EmbedBuilder()
                .setTitle('<'+target.username+'>의 죄인 투표')
                .setDescription('<@'+target.id+'>을(를) '+time+'분 만큼 죄인에 넣는데에 동의하십니까?');
                
                //interaction.reply('죄인투표를 시작합니다.');
                const pollTopic = await interaction.reply({
                    content: `10분간 죄인 투표를 시작합니다.`,
                    embeds: [embed],
                    fetchReply: true,
                });
                
                pollTopic.react("👍");
                pollTopic.react("👎");
                
                const filter = (reaction, user) => {
                    return reaction.emoji.name === "👍" && user.id === interaction.user.id;
                };

                const collector = pollTopic.createReactionCollector({filter, time: 10*60*1000}); // 10분간

                collector.on('collect', (reaction, user) => {
                    console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
                });

                collector.on('end', (collected) => {
                    if(collected.size >= 4){
                        addChriminal(interaction, target, time);
                    }else{
                        interaction.channel.send(`10분동안 4표 이하로 부결되었습니다. 투표수 : ${collected.size}`);
                    }
                })

            }
            
        }
    },
};

async function addChriminal(interaction, target, time){
    const member = await interaction.guild.members.fetch(target.id);
    if(!member.roles.valueOf().find(x=>x.name === '제인')){
        await interaction.channel.send('<@' + target.id + '>은(는) '+ time +'분 동안 죄인입니다.');
        //target을 죄인에 넣어두는 코드
        const chriminal_role = await interaction.guild.roles.valueOf().find(x=>x.name=== '제인');
        console.log(member);
        member.roles.add(chriminal_role);
        setTimeout(()=>deleteChriminal(member, interaction, target, chriminal_role), time*1000*60);
    }else{
        await interaction.channel.send("<@"+target.id+">은(는) 이미 죄인의 상태입니다.");
    }
}

function deleteChriminal(member, interaction, target, chriminal_role){
    member.roles.remove(chriminal_role);
    interaction.channel.send('<@'+target.id+'>'+'은(는) 죄인에서 풀려났습니다.');
}