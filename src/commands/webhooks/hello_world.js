const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');

const commandName = 'hello_world' // lowercase necessary

module.exports = {
	data: new SlashCommandBuilder()
		.setName(commandName)
		.setDescription('Hello World Webhook'),

	async execute(interaction) {
        // try / catch to avoid Bot crash on Discord API interaction missmatch
        try{
            if (interaction.commandName == commandName) {
            
                //Source https://discordjs.guide/popular-topics/embeds.html#using-the-embed-constructor
                const newEmbed = new EmbedBuilder()
                    .setColor("#B0F6E8")
                    .setTitle('Hello!')
                    .setDescription(`World`)
                    .setThumbnail(url= 'https://avatars.githubusercontent.com/u/138819662?v=4')
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                    .setFooter({text: 'Powered by EssncDev', iconURL: 'https://avatars.githubusercontent.com/u/138819662?v=4'})
                    .addFields(
                        {
                            name: 'First field',
                            value: `\n> - **Start here!**`
                        }
                    )
                    ;
                    
                await interaction.reply({
                    embeds: [newEmbed],
                    ephemeral: true // true = unvisible in chat
                });
            }
        }catch(err){
            console.log(err)
        }
	},
};