const ActiveSession = require('../models/active-session');

exports.getStream = (req, res, next) => {
	ActiveSession.playSession(req, res, req.streamkey);
	req.newURL = `/live/${req.streamkey}/${req.params.elem}`;
	next();
};

exports.getTest = (req, res) => {
	res.json({
		name: 'streaming-service-edge',
		status: 'OK',
		message: 'This is the streaming service of the edge nodes',
	});
	// Res.send('This is a proxy service.');
};
