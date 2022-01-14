const { getPlaylist, getChunk } = require('../requests/get-m3u8');
const { parsePlaylist } = require('../utils/playlist-interpreter');
const context = require('../utils/context');

class Player {
	constructor(streamId) {
		console.log(`Initializing: ${streamId}`);
		this.streamId = streamId;
		this.lastIndex = -1;
		this.remainingSegments = [];
		this.isStarted = false;
		this.updateSegments();
	}

	async updateSegments() {
		console.log(`Gathering segments: ${this.streamId}`);
		let playlist = await getPlaylist(this.streamId);
		if (playlist == null) {
			console.log(`Playlist not retrieved for ${this.streamId}`);
			context.emit('error_gathering_playlist', this.streamId);
			return;
		}
		let parsedPlaylist = parsePlaylist(playlist);

		if (
			this.lastIndex >= parsedPlaylist.startingElem &&
			this.lastIndex < parsedPlaylist.lastElem
		) {
			for (
				let i = this.lastIndex - parsedPlaylist.startingElem + 1;
				i < parsedPlaylist.segments.length;
				i++
			) {
				this.remainingSegments.push(parsedPlaylist.segments[i]);
				this.lastIndex = parsedPlaylist.segments[i].chunkIndex;
			}
			this.lastIndex = parsedPlaylist.lastElem;
		} else if (this.lastIndex < parsedPlaylist.startingElem) {
			parsedPlaylist.segments.forEach((elem) => {
				this.remainingSegments.push(elem);
				this.lastIndex = elem.chunkIndex;
			});
		}

		console.log(
			`Gathered segments for ${this.streamId}: lastIndex ${this.lastIndex}`
		);

		if (!this.isStarted) {
			this.playNext();
		}

		let timeout =
			parsedPlaylist.targetDuration * parsedPlaylist.segments.length * 900;

		// this.remainingSegments.forEach(({ duration }) => {
		// 	timeout += duration;
		// });

		// timeout = timeout * 900;

		console.log(`Next Update for ${this.streamId} in ${timeout}ms`);

		setTimeout(() => {
			this.updateSegments();
		}, timeout);
	}

	async playNext() {
		let currentElem = this.remainingSegments.shift();
		// console.log(this.remainingSegments);
		// If there is another element to pull
		if (currentElem) {
			this.lastDuration = currentElem.duration;
			console.log(
				`Playing new segment for ${this.streamId} - ${currentElem.chunkIndex} | Remaining: ${this.remainingSegments.length}`
			);
			const res = await getChunk(this.streamId, currentElem.chunk);
			console.log(this.streamId, currentElem.chunk, res);
			if (res === 200) {
				setTimeout(() => {
					this.playNext();
				}, currentElem.duration * 600);
			}
		} else {
			// Set player in idle
			this.isStarted = false;
		}
	}
}

module.exports = Player;
