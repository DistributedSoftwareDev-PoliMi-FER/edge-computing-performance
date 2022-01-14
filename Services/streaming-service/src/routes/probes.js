// NPM import modules
const express = require('express');
const router = express.Router();
const swaggerConf = require('../config/swagger.json');

router.use('/-/ready', (req, res) => {
	res.status(200).send('1');
});
router.use('/-/healthz', (req, res) => {
	res.status(200).send('1');
});

router.use('/documentation/json', (req, res) => {
	res.send(swaggerConf);
});

const swaggerUi = require('swagger-ui-express');
router.use(
	'/api/stream/openapi',
	swaggerUi.serve,
	swaggerUi.setup(swaggerConf)
);

module.exports = router;
