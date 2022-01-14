// NPM import modules
const express = require('express');
const enabled = express.Router();
const disabled = express.Router();

// Import controller and middlewares
const streamController = require('../controllers/stream');
const {
	validationRules,
	validate,
} = require('../middlewares/input-validation');

// Mock Authentication data
const mockAuthenticate = require('../controllers/mock-auth');
enabled.use('/api/stream/fakeauth', mockAuthenticate.authenticate);
enabled.get('/api/stream/fakeauth/private', streamController.getMyPrivate);
enabled.get('/api/stream/fakeauth/mystream', streamController.getMyStreamInfo);
enabled.delete(
	'/api/stream/fakeauth/mystream',
	streamController.deleteMyStreamInfo
);
enabled.post(
	'/api/stream/fakeauth/new',
	validationRules(),
	validate,
	streamController.newStream
);
enabled.post(
	'/api/stream/fakeauth/update',
	validationRules(),
	validate,
	streamController.updateStream
);

disabled.use('/api/stream/fakeauth', (req, res) => {
	res.sendStatus(404);
});

exports.disabled = disabled;
exports.enabled = enabled;
