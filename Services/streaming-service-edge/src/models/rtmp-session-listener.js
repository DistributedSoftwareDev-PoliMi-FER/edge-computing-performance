//
//  Created by Mingliang Chen on 17/8/4.
//  illuspas[a]gmail.com
//  Copyright (c) 2018 Nodemedia. All rights reserved.
//
//  Modified and adapted for the DSD project
//
const URL = require('url');
const Logger = require('node-media-server/src/node_core_logger');
const context = require('node-media-server/src/node_core_ctx');
const NodeCoreUtils = require('node-media-server/src/node_core_utils');
const config = require('../config/rtmp-edge');

class RtmpSessionListener {
	constructor(req, res, streamkey) {
		this.lastRequest = Date.now();
		this.config = config;
		this.req = req;
		this.res = res;
		this.id = NodeCoreUtils.generateNewSessionID();
		this.streamkey = streamkey;

		this.playStreamPath = '';
		this.playArgs = null;

		this.isStarting = false;
		this.isPlaying = false;
		this.isIdling = false;

		this.TAG = 'RTMP-MANUAL-PULL';

		this.numPlayCache = 0;
		context.sessions.set(this.id, this);
	}

	run() {
		const { method } = this.req;
		const urlInfo = URL.parse(this.req.url, true);
		const streamPath = `/live/${this.streamkey}`;

		this.connectCmdObj = {
			ip: 'localhost',
			method,
			streamPath,
			query: urlInfo.query,
		};

		this.connectTime = new Date();
		this.isStarting = true;

		Logger.log(
			`[${this.TAG} triggered] id=${this.id} ip=${
				this.ip
			} args=${JSON.stringify(urlInfo.query)}`
		);

		context.nodeEvent.emit('preConnect', this.id, this.connectCmdObj);

		if(!this.isStarting) {
			this.stop();
			return;
		}

		context.nodeEvent.emit('postConnect', this.id, this.connectCmdObj);

		this.playStreamPath = streamPath;
		this.playArgs = urlInfo.query;

		this.onPlay();
	}

	stop() {
		if(this.isStarting) {
			this.isStarting = false;
			const publisherId = context.publishers.get(this.playStreamPath);
			if(publisherId != null) {
				context.sessions.get(publisherId).players.delete(this.id);
				context.nodeEvent.emit(
					'donePlay',
					this.id,
					this.playStreamPath,
					this.playArgs
				);
			}

			context.nodeEvent.emit('deleteActiveSession', this.streamkey);

			Logger.log(
				`[${this.TAG} play] Close stream. id=${this.id} streamPath=${this.playStreamPath}`
			);
			Logger.log(`[${this.TAG} disconnect] id=${this.id}`);

			context.idlePlayers.delete(this.id);
			context.sessions.delete(this.id);
		}
	}

	onReqClose() {
		this.stop();
	}

	onReqError(e) {
		Logger.error(e);
		this.stop();
	}

	reject() {
		Logger.log(`[${this.TAG} reject] id=${this.id}`);
		this.stop();
	}

	onPlay() {
		context.nodeEvent.emit(
			'prePlay',
			this.id,
			this.playStreamPath,
			this.playArgs
		);

		if(!this.isStarting) {
			return;
		}

		// // AUTH Things
		// if (this.config.auth !== undefined && this.config.auth.play) {
		// 	const results = NodeCoreUtils.verifyAuth(
		// 		this.playArgs.sign,
		// 		this.playStreamPath,
		// 		this.config.auth.secret
		// 	);
		// 	if (!results) {
		// 		Logger.log(
		// 			`[${this.TAG} play] Unauthorized. id=${this.id} streamPath=${this.playStreamPath} sign=${this.playArgs.sign}`
		// 		);
		// 		this.res.statusCode = 403;
		// 		this.res.end();
		// 		return;
		// 	}
		// }

		if(!context.publishers.has(this.playStreamPath)) {
			Logger.log(
				`[${this.TAG} play] Stream not found. id=${this.id} streamPath=${this.playStreamPath} `
			);
			context.idlePlayers.add(this.id);
			this.isIdling = true;
			return;
		}

		this.onStartPlay();
	}

	onStartPlay() {
		const publisherId = context.publishers.get(this.playStreamPath);
		const publisher = context.sessions.get(publisherId);
		const { players } = publisher;
		players.add(this.id);

		this.isIdling = false;
		this.isPlaying = true;
		Logger.log(
			`[${this.TAG} play] Join stream. id=${this.id} streamPath=${this.playStreamPath} `
		);
		context.nodeEvent.emit(
			'postPlay',
			this.id,
			this.playStreamPath,
			this.playArgs
		);
	}
}

module.exports = RtmpSessionListener;
