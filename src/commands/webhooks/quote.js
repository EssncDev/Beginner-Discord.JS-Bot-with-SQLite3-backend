const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { sqliteClient } = require('../../../modules/sqlClient.js');

const commandName = 'quote'; // lowercase necessary

module.exports = {
	data: new SlashCommandBuilder()
		.setName(commandName)
		.setDescription('Display random quote'),

	async execute(interaction) {

        // try / catch to avoid Bot crash on Discord API interaction missmatch
        try{
            if (interaction.commandName == commandName) {
                const sqlObj = new sqliteClient('bot_db');
                const tableColumns = await sqlObj.get_Table_content('SELECT * FROM quotes');
                const random = Math.floor((Math.random() * tableColumns.length) +1);
            
                //Source https://discordjs.guide/popular-topics/embeds.html#using-the-embed-constructor
                const newEmbed = new EmbedBuilder()
                    .setColor("#79CCDA")
                    .setTitle('Quote')
                    .setAuthor({name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
                    .setFooter({text: 'Powered by EssncDev', iconURL: 'https://avatars.githubusercontent.com/u/138819662?v=4'})
                    .addFields(
                        {
                            name: `${tableColumns[random].author}:`,
                            value: `>  *${tableColumns[random].quote}*`
                        }
                    );
                    
                await interaction.reply({
                    embeds: [newEmbed],
                    ephemeral: true // true = unvisible in chat
                });
                await sqlObj.close_connection();
            }
        }catch(err){
            console.log(err)
        }
	},
};