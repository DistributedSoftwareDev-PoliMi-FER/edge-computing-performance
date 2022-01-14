const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = createProxyMiddleware({
	target: process.env.STREAM_SERVICE_HOST,
	changeOrigin: true,
});
