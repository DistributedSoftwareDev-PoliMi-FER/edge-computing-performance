const express = require('express');

const streamController = require('../controller/stream');
const translateStreamid = require('../middleware/translate-streamid');
const proxy = require('express-http-proxy');

const router = express.Router();

router.get('/api/stream', streamController.getTest);

// Route to the main all the unhandled requests
router.get(
	'/api/stream/:something',
	proxy(process.env.MAIN_API_SERVICE_HOST, {
		proxyReqPathResolver: function(req) {
			return req.originalUrl;
		},
	})
);
router.use(
	'/api/stream/fakeauth',
	proxy(process.env.MAIN_API_SERVICE_HOST, {
		proxyReqPathResolver: function(req) {
			return req.originalUrl;
		},
	})
);
router.use(
	'/api/stream/auth',
	proxy(process.env.MAIN_API_SERVICE_HOST, {
		proxyReqPathResolver: function(req) {
			return req.originalUrl;
		},
	})
);

// Get locally the streams chunks
router.get(
	'/api/stream/:streamid/:elem',
	translateStreamid,
	streamController.getStream,
	proxy(process.env.STREAM_SERVICE_HOST, {
		proxyReqPathResolver: function(req) {
			return req.newURL;
		},
		userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
			if(proxyRes.statusCode === 404) {
				return new Promise(function(resolve) {
					setTimeout(function() {
						// Wait for the creation of a playlist and try again
						userRes.setHeader('location', userReq.originalUrl);
						userRes.status(302);
						resolve('');
					}, 500);
				});
			}
			return proxyResData;
		},
	})
);

module.exports = router;
