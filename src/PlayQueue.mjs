import ytsr from 'ytsr';
import ytdl from 'ytdl-core';

export default class PlayQueue {

    constructor(voiceChannel) {
        this.voiceChannel = voiceChannel;
        this.queue = new Array();
        this.currentSong = undefined;
        this.connection = undefined;
    }

    async search(videoName) {
        const videoFilters = await ytsr.getFilters(videoName);
        const filterUrl = videoFilters.get('Type').get('Video').url;
        const searchResults = await ytsr(filterUrl, {limit: 1});
        const video = searchResults.items[0];
        return video.url;
    }

    async getVideoUrl(videoName) {
        let videoUrl;
        if(videoName) {
            videoUrl = await this.search(videoName);
        } else {
            videoUrl = this.queue.shift();
        }
        return videoUrl;
    }

    async play(messageContent='') {
        if(!this.voiceChannel) {
            return 'No Voice Channel Active';
        }
        const videoName = this.getVideoName(messageContent);
        if(this.currentSong && this.currentSong.paused && !videoName) {
            this.currentSong.resume();
            return 'Resuming Song';
        }
        const videoUrl = await this.getVideoUrl(videoName);
        if(!videoUrl) {
            return 'No Song Found';
        }
        if(!this.connection) {
            this.connection = await this.voiceChannel.join();
        }
        if(this.currentSong) {
            this.currentSong.destroy();
        }
        this.currentSong = this.connection.playStream(ytdl(videoUrl));
        this.currentSong.on('end', () => {
            this.currentSong = undefined;
            this.play();
        });
        return `Playing Song. ${videoUrl}`;
    }

    async addToQueue(messageContent) {
        const videoName = this.getVideoName(messageContent);
        if(!videoName) {
            return 'No Song Provided.';
        }
        const videoUrl = await this.search(videoName);
        this.queue.push(videoUrl);
        return `Added Song to Queue. ${videoUrl}`
    }

    getVideoName(messageContent) {
        if(messageContent.length > 1) {
            return messageContent.slice(1, messageContent.length).join(' ');
        } else {
            return '';
        }
    }

    stop() {
        if(this.currentSong) {
            this.currentSong.destroy();
        }
        this.connection = undefined;
        this.voiceChannel.leave();
        return 'Leaving you alone.';
    }

    pause() {
        if(this.currentSong && !this.currentSong.paused) {
            this.currentSong.pause();
            return 'Paused Song';
        }
        return 'Nothing To Pause';
    }

    skip() {
        if(this.currentSong) {
            this.currentSong.destroy();
            this.play();
        }
    }
}
