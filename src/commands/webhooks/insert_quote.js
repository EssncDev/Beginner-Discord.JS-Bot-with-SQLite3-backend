const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { sqliteClient } = require('../../../modules/sqlClient.js');

const commandName = 'insert_quote'; // lowercase necessary

module.exports = {
	data: new SlashCommandBuilder()
		.setName(commandName)
		.setDescription('Insert quote')
        .addStringOption(option => 
            option
                .setRequired(true)
                .setName('quote')
                .setDescription('Insert quote here')    
            )
        .addStringOption(option => 
            option
                .setRequired(false)
                .setName('author')
                .setDescription('Add Author')
            ),

	async execute(interaction) {

        // try | catch to avoid Bot crash on Discord API interaction missmatch
        try{
            if (interaction.commandName == commandName) {
                const sqlObj = new sqliteClient('bot_db');
                const insertReturn = await sqlObj.insert_into('quotes', 'quote, author', `'${interaction.options.getString('quote')}','${interaction.options.getString('author')}'`);
                
                if(insertReturn){
                    //Source https://discordjs.guide/popular-topics/embeds.html#using-the-embed-constructor
                    const newEmbed = new EmbedBuilder()
                        .setColor("#7BBB5F")
                        .setTitle('Quote inserted')
                        .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                        .setFooter({text: 'Powered by EssncDev', iconURL: 'https://avatars.githubusercontent.com/u/138819662?v=4'})
                        
                    await interaction.reply({
                        embeds: [newEmbed],
                        ephemeral: true // true = unvisible in chat
                    });
                    await sqlObj.close_connection();
                }else{
                    await interaction.reply({
                        content: 'Insert failed!',
                        ephemeral: true // true = unvisible in chat
                    });
                }
            }
        }catch(err){
            console.log(err)
        }
	},
};