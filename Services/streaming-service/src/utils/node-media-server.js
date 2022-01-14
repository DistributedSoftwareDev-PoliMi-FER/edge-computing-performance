const NodeMediaServer = require('node-media-server');
const configRTPM = require('../config/rtmp-config');
const Stream = require('../models/stream');

const nms = new NodeMediaServer(configRTPM);

nms.on('prePublish', async(id, StreamPath, args) => {
	const streamkey = getStreamKeyFromStreamPath(StreamPath);
	const session = nms.getSession(id);
	console.log(
		'[NodeEvent on prePublish]',
		`id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
	);
	const elem = await Stream.findOne({ streamkey: streamkey }).exec();
	if(!elem) {
		return session.reject();
	}
	else {
		elem.status = 'ONLINE';
		elem.save();
		return;
	}
});

nms.on('donePublish', (id, StreamPath, args) => {
	const streamkey = getStreamKeyFromStreamPath(StreamPath);
	console.log(
		'[NodeEvent on donePublish]',
		`id=${id} StreamPath=${StreamPath} args=${JSON.stringify(args)}`
	);

	Stream.findOne({ streamkey: streamkey }).then((stream) => {
		if(stream) {
			stream.status = 'OFFLINE';
			stream.save();
		}
	});
	return;
});

function getStreamKeyFromStreamPath(path) {
	const parts = path.split('/');
	return parts[parts.length - 1];
}

module.exports = nms;
