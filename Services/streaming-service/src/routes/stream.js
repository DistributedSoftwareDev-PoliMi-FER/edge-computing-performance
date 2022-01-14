// NPM import modules
const express = require('express');
const router = express.Router();
const jwtCheck = require('../utils/jwtCheck');

// Import controller and middlewares
const streamController = require('../controllers/stream');
const translateStreamid = require('../middlewares/translate-streamid');
const proxy = require('../middlewares/proxy');
const {
	validationRules,
	validate,
} = require('../middlewares/input-validation');

router.get('/api/stream', streamController.getTest);

router.get('/api/stream/public', streamController.getAllPublic);

// REAL AUTH
router.use('/api/stream/auth', jwtCheck);
router.get('/api/stream/auth/private', streamController.getMyPrivate);
router.get('/api/stream/auth/mystream', streamController.getMyStreamInfo);
router.delete('/api/stream/auth/mystream', streamController.deleteMyStreamInfo);

router.post(
	'/api/stream/auth/new',
	validationRules(),
	validate,
	streamController.newStream
);

router.post(
	'/api/stream/auth/update',
	validationRules(),
	validate,
	streamController.updateStream
);

router.get(
	'/api/stream/:streamid/:elem',
	translateStreamid,
	streamController.getStream,
	proxy
);
router.get('/api/stream/:streamId', streamController.getStreamInfo);

module.exports = router;
