// Load env from .env
require('dotenv').config();

const context = require('./utils/context');

const { requestPublicStreams } = require('./requests/all-streams');

const Player = require('./classes/player');
const players = new Map();

context.on('error_gathering_playlist', (streamId) => {
	players.delete(streamId);
});

const run = async () => {
	console.log('Requesting all publicly available streams');
	let res = await requestPublicStreams();
	res = res.map((elem) => elem._id);
	console.log(
		`Streams available: ${res.length} - Running players: ${players.size}`
	);
	res.forEach(async (element) => {
		if (players.get(element) == undefined) {
			console.log('Pulling a new stream!');
			players.set(element, new Player(element));
		}
	});

	setTimeout(run, 5000);
};

run();
