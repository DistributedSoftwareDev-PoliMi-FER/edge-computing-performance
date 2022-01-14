// Start method
const Start = (app, dbString, port, enableFakeAuth) => {
	// NPM Module imports
	const bodyParser = require('body-parser');
	const fs = require('fs');
	const mongoose = require('mongoose');

	// Load NMS
	const nms = require('./utils/node-media-server');

	// Clean the HLS transcode folder
	const dir = './media/live';
	fs.rmSync(dir, { recursive: true, force: true });

	// Connect to Auth0 and retrieve a valid token
	const auth0APIs = require('./utils/auth0-api');
	auth0APIs.updateToken();

	// Define Routes
	const fakeAuthRoutes = require('./routes/fake-auth');
	const streamRoutes = require('./routes/stream');
	const edgeNodesRoutes = require('./routes/edge-nodes');
	const probesRoutes = require('./routes/probes');

	// Setup the parsers
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	// Specific header for the proxy response
	app.use(async (req, res, next) => {
		res.header({
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': '*',
			'x-access-key': '*',
		});
		next();
	});

	// Setup the routes
	if (enableFakeAuth) {
		app.use(fakeAuthRoutes.enabled);
	} else {
		app.use(fakeAuthRoutes.disabled);
	}
	app.use(probesRoutes);
	app.use(streamRoutes);
	app.use(edgeNodesRoutes);

	// Generic error handler
	app.use((err, req, res, next) => {
		if ('UnauthorizedError' === err.name) {
			res.sendStatus(403);
		} else {
			res.status(500).send('Error!');
		}
		console.log(err.name);
		next();
	});

	// Connect DB
	mongoose
		.connect(dbString)
		.then(() => {
			// Console.log('DB Connected!');
		})
		.catch((err) => {
			console.log(err);
		});

	// Start the express app
	app.listen(port, () => {
		console.log(`Listening at port: ${port}`);
	});

	// Start the RTMP Relay
	nms.run();
};

module.exports = Start;
