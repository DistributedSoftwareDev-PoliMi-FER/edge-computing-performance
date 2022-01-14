require('dotenv').config();
const express = require('express');
// Create Express Server
const app = express();
const streamingServiceEdge = require('./streaming-service-edge');

streamingServiceEdge(app, process.env.EDGE_HTTP_PORT);
