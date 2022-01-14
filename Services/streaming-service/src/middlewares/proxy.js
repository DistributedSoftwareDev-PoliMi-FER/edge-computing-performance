const proxy = require('express-http-proxy');

module.exports = proxy('http://localhost:8888/', {
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
});
