const { REST, Routes } = require('discord.js');

const TOKEN = "MTA5NzU0ODg4MzAxOTcxNDU3MA.G9_gjL.QY1I9NdXB6Ad8677eqIgn4dYAlM_PgBPupMvWI"
const CLIENT_ID = "1097548883019714570"
const commands = [
  {
    name: 'uwu',
    description: 'Replay giga UWU',
  },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();


const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'uwu') {
    await interaction.reply('*UwU*');
  }
});

const keyword = /s.*e.*x.*/;

client.on('messageCreate', (message) => {
    if (keyword.test(message.content)) {
        message.channel.send(message.content)
    }
})

client.login(TOKEN);