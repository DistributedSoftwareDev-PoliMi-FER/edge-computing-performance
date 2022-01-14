// NPM import modules
const express = require('express');
const router = express.Router();

// Import controller and middlewares
const edgeNodesController = require('../controllers/edge-nodes');
const translateStreamid = require('../middlewares/translate-streamid');
const edgeNodeAuth = require('../middlewares/edge-node-auth');

router.get(
	'/edge-api/stream/:streamid',
	edgeNodeAuth,
	translateStreamid,
	edgeNodesController.getKey
);

module.exports = router;
