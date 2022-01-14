const allSessions = [];
const context = require('node-media-server/src/node_core_ctx');
const axios = require('axios');

const RtmpSessionListener = require('./rtmp-session-listener');

let initialized = false;

class ActiveSession {
	constructor(req, res, streamkey) {
		this.rtmpListener = new RtmpSessionListener(req, res, streamkey);
		this.streamkey = streamkey;
		this.recentlyUpdated = false;
		this.lastRequest = Date.now();
	}

	static initialize() {
		if(initialized) {
			return;
		}
		initialized = true;

		setInterval(this.checkIdleStream, 30000);

		context.nodeEvent.on('deleteActiveSession', (args) => {
			this.getSession(args).remove();
		});
	}

	save() {
		this.update();
		allSessions.push(this);
	}

	update() {
		if(!this.recentlyUpdated) {
			this.lastRequest = Date.now();
			this.recentlyUpdated = true;

			setTimeout(() => {
				this.recentlyUpdated = false;
			}, 30000);
		}
	}

	remove() {
		const index = allSessions.indexOf(this);
		allSessions.splice(index, 1);
	}

	static checkIdleStream() {
		allSessions.forEach((elem) => {
			if(elem.lastRequest + 60000 < Date.now()) {
				elem.stopSession();
			}
		});
	}

	startSession() {
		axios({
			method: 'post',
			url: `${process.env.STREAM_SERVICE_HOST}/api/relay/pull`,
			data: {
				url: `${process.env.RTMP_MAIN_SERVER}/live/${this.streamkey}`,
				name: this.streamkey,
				app: 'live',
			},
		})
			// .then(({ status }) => {
			//   console.log(status);
			// })
			.catch((error) => {
				console.log(error);
			});

		this.rtmpListener.run();
	}

	stopSession() {
		axios
			.delete(
				`${process.env.STREAM_SERVICE_HOST}/api/streams/live/${this.streamkey}`
			)
			.catch((error) => {
				console.log(error.name);
			});
		// This.remove();
	}

	static playSession(req, res, streamkey) {
		this.initialize();
		let activeSession = this.getSession(streamkey);

		if(!activeSession) {
			activeSession = new ActiveSession(req, res, streamkey);
			activeSession.startSession();
			activeSession.save();

			return false;
		}
		activeSession.update();

		return true;
	}

	static getSession(streamkey) {
		return allSessions.find((elem) => elem.streamkey === streamkey);
	}
}

module.exports = ActiveSession;
