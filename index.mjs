import PlayQueue from './src/PlayQueue.mjs';
import handleMessage from './src/MessageHandler.mjs';
import dotenv from 'dotenv';
import Discord from 'discord.js';

dotenv.config(); // load env variables
const bot = new Discord.Client(); // init bot
const queueMap = new Map(); // init queue map
bot.login(process.env.TOKEN); // login to bot with token

bot.on('message', async (msg) => {
    const guildId = msg.guild.id;
    let queue = queueMap.get(guildId);
    if(!queue) {
      queue = new PlayQueue(msg.member.voiceChannel);
      queueMap.set(guildId, queue);
    } else {
      queue.voiceChannel = msg.member.voiceChannel;
    }
    const response = await handleMessage(msg, queue);
    if(response) {
      msg.reply(response);
    }
});