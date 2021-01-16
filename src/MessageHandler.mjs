
export default async function handleMessage(msg, queue) {
    const messageContent = (msg.content.toLowerCase()).split(' ');
    switch(messageContent[0]) {
        case '!play':
            return queue.play(messageContent);
        case '!queue':
            return queue.addToQueue(messageContent);
        case '!pause':
            return queue.pause();
        case '!skip':
            return queue.skip();
        case '!stop':
            return queue.stop();
        case '!help':
            return `
\`!play\`: provide either a song name or resume a paused song by providing no song name
\`!queue\`: provide a song name to add the song to the queue.
\`!stop\`: will leave the voice channel.
\`!skip\`: skip the next song in the queue
\`!help\`: displays helpful instructions
`;
    }
}
