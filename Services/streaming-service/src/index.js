// Load env from .env
require('dotenv').config();
// NPM Module imports
const express = require('express');
// Create Express Server
const app = express();

const streamingService = require('./streaming-service');

streamingService(app, process.env.MONGODB_URL, process.env.HTTP_PORT, false);
