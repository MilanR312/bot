const { SlashCommandBuilder } = require('@discordjs/builders');

const {PrintEmbeds, Poll}  = require('./PollData/PollBuild');

ActivePolls = [];
lastActivePoll = null;

emojiLookup = ["🇦", "🇧","🇨"]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Used to make a poll')
        .addSubcommand(subcommand => 
            subcommand
                .setName('create')
                .setDescription('Default Setup for poll')
                .addStringOption(option => option.setName('title').setRequired(true).setDescription('The title of the poll'))
                .addStringOption(option => option.setName('description').setRequired(true).setDescription('The title of the poll'))
            )
        .addSubcommand(subcommand =>
            subcommand
                .setName('addquestion')
                .setDescription('Adds a question to the poll')
                .addStringOption(option => option.setName('question').setRequired(true).setDescription('The title of the poll'))
                .addStringOption(option => option.setName('answer').setRequired(true).setDescription('The title of the poll'))
            )
        .addSubcommand(subcommand =>
            subcommand
                .setName('confirm')
                .setDescription('send the poll')
            )
        ,
    async execute(interaction) {
        console.log(ActivePolls);
        console.log(lastActivePoll);

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {    
            const Titel = interaction.options.getString('title');
            const Description = interaction.options.getString('description');

            //generate new poll with previous data
            let Polltest = new Poll(Titel, Description);
            ActivePolls.push(Polltest);
            lastActivePoll = Polltest;
            //send the current poll
            interaction.reply({ embeds: [Polltest.mainPoll] , ephemeral: true});
        }
        else if (subcommand === 'addquestion') {
            const Question = interaction.options.getString('question');
            const Answer = interaction.options.getString('answer');
            
            //add the question to the active poll
            lastActivePoll.addQuestion(Question,Answer);

            //send the current poll
            PrintEmbeds(interaction, lastActivePoll.getEmbeds(), true)
        }
        else if (subcommand === 'confirm') {
            //send the poll and add reactions
            PrintEmbeds(interaction, lastActivePoll.getEmbeds(), false)
        }
    }
};