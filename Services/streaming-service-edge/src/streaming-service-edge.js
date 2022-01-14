// Start method
const Start = (app, port) => {
	const bodyParser = require('body-parser');
	const NodeMediaServer = require('node-media-server');
	const fs = require('fs');

	const config = require('./config/rtmp-edge');

	const dir = './media/live';
	fs.rmSync(dir, { recursive: true, force: true });

	// Define Routes
	const streamRoutes = require('./routes/stream');
	const probesRoutes = require('./routes/probes');

	// Setup the parsers
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	// Specific header for the proxy response
	app.use(async(req, res, next) => {
		res.header({
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
			'x-access-key': '*',
		});
		next();
	});

	// Setup the routes
	app.use(probesRoutes);
	app.use(streamRoutes);

	// Start the Proxy
	app.listen(port, () => {
		console.log(`Starting Proxy at port:${port}`);
	});

	// Start the RTMP Relay
	const nms = new NodeMediaServer(config);
	nms.run();
};

module.exports = Start;
