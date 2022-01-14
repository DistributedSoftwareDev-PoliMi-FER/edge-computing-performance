// Const ActiveSession = require('../models/active-session');
const Stream = require('../models/stream');
const axios = require('axios');

// Auth0 APIs
const auth0API = require('../utils/auth0-api');

async function normalizeStream(stream) {
	// If there are invited users
	if(stream.invited.length > 0) {
		const users = await auth0API.translateMulipleUserIds(stream.invited);
		stream.invited = users;
	}
	// Translate the userid to username
	stream.author = await auth0API.translateOneUserId(stream.author);
	return stream;
}

async function normalizeStreamPub(stream) {
	let result = await normalizeStream(stream);
	return {
		_id: result._id,
		title: result.title,
		author: result.author,
		description: result.description,
		thumbnail: result.thumbnail,
		status: result.status,
	};
}

exports.getStream = (req, res, next) => {
	req.newURL = `/live/${req.streamkey}/${req.params.elem}`;
	next();
};

exports.getTest = (req, res) => {
	res.json({
		name: 'streaming-service-v2',
		status: 'OK',
		message: 'This is the streaming service of the main node',
	});
};

exports.deleteMyStreamInfo = (req, res, next) => {
	const author = req.user.sub;

	Stream.findOne({ author: author })
		.then((stream) => {
			if(!stream) {
				return res.sendStatus(404);
			}
			// Ask to stop the stream
			axios({
				method: 'delete',
				url: `http://localhost:8888/api/streams/live/${stream.streamkey}`,
				data: {
					url: `${process.env.RTMP_MAIN_SERVER}/live/${this.streamkey}`,
					name: this.streamkey,
					app: 'live',
				},
			}).catch(() => {
				console.log('no stream running');
			});
			// Delete the stream from DB
			Stream.deleteOne({ author: author })
				.then()
				.catch((err) => {
					console.log(err);
				});
			res.status(200).send('Stream deleted successfully');
		})
		.catch((err) => {
			next(err);
		});
};

exports.getMyStreamInfo = (req, res, next) => {
	const author = req.user.sub;

	Stream.findOne({ author: author })
		.then(async(stream) => {
			// No stream available for that user
			if(!stream) {
				return res.sendStatus(404);
			}
			stream = await normalizeStream(stream);
			res.json(stream);
		})
		.catch((err) => {
			next(err);
		});
};

exports.getStreamInfo = (req, res) => {
	const streamId = req.params.streamId;
	Stream.findById(streamId)
		.then(async(stream) => {
			if(!stream) {
				return res.sendStatus(404);
			}
			stream = await normalizeStreamPub(stream);
			res.json(stream);
		})
		.catch(() => {
			return res.sendStatus(404);
		});
};

exports.getAllPublic = async(req, res, next) => {
	Stream.find({ type: 'PUBLIC', status: 'ONLINE' })
		.then((streams) => {
			if(!streams) {
				return res.sendStatus(404);
			}
			const allStreams = streams.map(async(stream) => {
				// Const { data } = await translateId(stream.author);
				stream = await normalizeStreamPub(stream);
				// Console.log(data);
				return stream;
			});
			Promise.all(allStreams).then((result) => {
				res.json(result);
			});
		})
		.catch((err) => {
			next(err);
		});
};

exports.getMyPrivate = async(req, res, next) => {
	// Stream.find({ invited: req.user.sub, status: 'ONLINE' })
	Stream.find({
		$or: [
			{ invited: req.user.sub, status: 'ONLINE' },
			{ author: req.user.sub, type: 'PRIVATE' },
		],
	})
		.then((streams) => {
			if(!streams) {
				return res.sendStatus(404);
			}
			const allStreams = streams.map(async(stream) => {
				// Const { data } = await translateId(stream.author);
				stream = await normalizeStreamPub(stream);
				// Console.log(data);
				return stream;
			});
			Promise.all(allStreams).then((result) => {
				res.json(result);
			});
		})
		.catch((err) => {
			next(err);
		});
};

exports.updateStream = async(req, res, next) => {
	const title = req.body.title;
	const thumbnail = req.body.thumbnail;
	const description = req.body.description;
	let invited = req.body.invited ? req.body.invited : [];
	if(invited.length > 0) {
		const users = await auth0API.translateMulipleUsernames(invited);
		invited = users;
	}
	const type = req.body.type;
	const author = req.user.sub;

	// Find the stream to update
	Stream.findOne({ author: author })
		.then((stream) => {
			// No stream found
			if(!stream) {
				return res.sendStatus(404);
			}
			// We can update the stream details
			stream.title = title;
			stream.thumbnail = thumbnail;
			stream.description = description;
			stream.invited = invited;
			stream.type = type;
			stream.save().then(() => {
				res.status(200).send('Info updated successfully');
			});
		})
		.catch((err) => {
			next(err);
		});
};

exports.newStream = async(req, res, next) => {
	// Load data from request
	const title = req.body.title;
	const thumbnail = req.body.thumbnail;
	const description = req.body.description;
	let invited = req.body.invited ? req.body.invited : [];
	if(invited.length > 0) {
		const users = await auth0API.translateMulipleUsernames(invited);
		invited = users;
	}
	const type = req.body.type;
	const author = req.user.sub;

	// Delete all streams created by this user
	Stream.deleteMany({ author: req.user.sub })
		.then(() => {
			// Create new stream
			const stream = new Stream({
				title: title,
				thumbnail: thumbnail,
				description: description,
				invited: invited,
				type: type,
				author: author,
			});

			// Generate the streamkey and save
			stream
				.generateStreamKey()
				.then(() => {
					// Stream created
					console.log('New stream created!');
					res.status(201).send('Stream created successfully');
				})
				.catch((err) => {
					// Error!
					next(err);
				});
		})
		.catch((err) => {
			next(err);
		});
};
