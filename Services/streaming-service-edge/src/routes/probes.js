// NPM import modules
const express = require('express');
const router = express.Router();

router.use('/-/ready', (req, res) => {
	res.status(200).send('1');
});
router.use('/-/healthz', (req, res) => {
	res.status(200).send('1');
});

module.exports = router;
