// Load env from .env
require('dotenv').config();

const chai = require('chai');
const express = require('express');
const connectionDB = require('./db/mock-db');
const chaiHttp = require('chai-http');
const streamingService = require('../src/streaming-service');

const pushStream = require('./video/pushStream');
// Await new Promise((resolve) => setTimeout(resolve, 10000));

const app = express();
chai.use(chaiHttp);

describe('Endpoint tests', () => {
	before(async function () {
		const dbUri = await connectionDB();
		streamingService(app, dbUri, 3000, true);
		await new Promise((resolve) => setTimeout(resolve, 1000));
	});

	it('Check GET (service status) request', async () => {
		const res = await chai
			.request(app)
			.get('/api/stream')
			.then((res) => {
				return res;
			});

		//Check the streaming service default response
		chai.expect(res.body).to.be.an('object');
		chai
			.expect(res.body)
			.to.have.property('name')
			.that.is.equal('streaming-service-v2');
		chai.expect(res.body).to.have.property('status').that.is.equal('OK');
		chai
			.expect(res.body)
			.to.have.property('message')
			.that.is.equal('This is the streaming service of the main node');
	});

	it('Check GET (My stream info - no stream) request', async () => {
		const res = await chai
			.request(app)
			.get('/api/stream/fakeauth/mystream')
			.then((res) => {
				return res;
			});

		//Check no stream case
		chai.expect(res.body).to.be.an('object');
		chai.expect(Object.keys(res.body).length).to.equal(0);
	});

	it('Check POST (New Stream) request', async () => {
		const newStream = {
			title: 'New stream title',
			thumbnail: 'http://this.is.a.link',
			description: 'New stream description',
			type: 'PUBLIC',
			invited: [],
		};

		const res = await chai
			.request(app)
			.post('/api/stream/fakeauth/new')
			.set('content-type', 'application/json')
			.send(newStream)
			.then((res) => {
				return res;
			});

		//Check no stream case
		chai.expect(res.text).to.be.an('string');
		chai.expect(res.text).to.equal('Stream created successfully');
	});

	it('Check GET (My stream info - stream) request', async () => {
		const streamInfo = {
			title: 'New stream title',
			thumbnail: 'http://this.is.a.link',
			description: 'New stream description',
			type: 'PUBLIC',
			invited: [],
		};

		const res = await chai
			.request(app)
			.get('/api/stream/fakeauth/mystream')
			.then((res) => {
				return res;
			});

		// console.log(res.body);

		//Check no stream case
		chai.expect(res.body).to.be.an('object');
		chai.expect(Object.keys(res.body).length).to.equal(10);
		chai.expect(res.body.title).to.equal(streamInfo.title);
		chai.expect(res.body.thumbnail).to.equal(streamInfo.thumbnail);
		chai.expect(res.body.description).to.equal(streamInfo.description);
		chai.expect(res.body.type).to.equal(streamInfo.type);
		chai.expect(res.body.invited.length).to.equal(0);
		chai.expect(res.body.status).to.equal('OFFLINE');
		chai.expect(res.body.author).to.equal('umessuti');
	});

	it('Check GET (Stream info) request', async () => {
		const streamInfo = {
			title: 'New stream title',
			thumbnail: 'http://this.is.a.link',
			description: 'New stream description',
			type: 'PUBLIC',
			invited: [],
		};

		const stream = await chai
			.request(app)
			.get('/api/stream/fakeauth/mystream')
			.then((res) => {
				return res;
			});

		const res = await chai
			.request(app)
			.get(`/api/stream/${stream.body._id}`)
			.then((res) => {
				return res;
			});

		// Console.log(res.body);

		//Check no stream case
		chai.expect(res.body).to.be.an('object');
		chai.expect(Object.keys(res.body).length).to.equal(6);
		chai.expect(res.body._id).to.equal(stream.body._id);
		chai.expect(res.body.title).to.equal(streamInfo.title);
		chai.expect(res.body.thumbnail).to.equal(streamInfo.thumbnail);
		chai.expect(res.body.description).to.equal(streamInfo.description);
		chai.expect(res.body.status).to.equal('OFFLINE');
		chai.expect(res.body.author).to.equal('umessuti');
	});

	it('Check POST (Update Stream) request', async () => {
		const newStream = {
			title: 'Updated stream title',
			thumbnail: 'http://this.is.a.link.updated',
			description: 'Updated stream description',
			type: 'PRIVATE',
			invited: ['umessuti'],
		};

		const res = await chai
			.request(app)
			.post('/api/stream/fakeauth/update')
			.set('content-type', 'application/json')
			.send(newStream)
			.then((res) => {
				return res;
			});

		//Check no stream case
		chai.expect(res.text).to.be.an('string');
		chai.expect(res.text).to.equal('Info updated successfully');
	});

	it('Check GET (My stream info - stream) request', async () => {
		const streamInfo = {
			title: 'Updated stream title',
			thumbnail: 'http://this.is.a.link.updated',
			description: 'Updated stream description',
			type: 'PRIVATE',
			invited: ['umessuti'],
		};

		const res = await chai
			.request(app)
			.get('/api/stream/fakeauth/mystream')
			.then((res) => {
				return res;
			});

		const CryptoJS = require('crypto-js');

		const date = Date.now();
		let messageToEncrypt = `AuthorizationAPI:${date}`;
		var apikey = CryptoJS.AES.encrypt(
			messageToEncrypt,
			process.env.EDGENODE_SECRET
		);

		const res2 = await chai
			.request(app)
			.get(`/edge-api/stream/${res.body._id}`)
			.set('apikey', apikey)
			.then((res) => {
				return res;
			});

		// Console.log(res2.body);

		//Check no stream case
		chai.expect(res2.body).to.be.an('object');
		chai.expect(Object.keys(res2.body).length).to.equal(1);
		chai.expect(res2.body.streamkey).to.equal(res.body.streamkey);

		chai.expect(res.body).to.be.an('object');
		chai.expect(Object.keys(res.body).length).to.equal(10);
		chai.expect(res.body.title).to.equal(streamInfo.title);
		chai.expect(res.body.thumbnail).to.equal(streamInfo.thumbnail);
		chai.expect(res.body.description).to.equal(streamInfo.description);
		chai.expect(res.body.type).to.equal(streamInfo.type);
		chai.expect(res.body.invited.length).to.equal(1);
		chai.expect(res.body.status).to.equal('OFFLINE');
		chai.expect(res.body.author).to.equal('umessuti');
	});

	it('Check GET (My stream info - AUTH) request', async () => {
		const res = await chai.request(app).get('/api/stream/auth/mystream');
		chai.expect(res.status).to.equal(403);
	});

	it('Check GET (Stream info) request', async () => {
		const streamInfo = {
			title: 'Updated stream title',
			thumbnail: 'http://this.is.a.link.updated',
			description: 'Updated stream description',
			type: 'PRIVATE',
			invited: ['umessuti'],
		};

		const stream = await chai
			.request(app)
			.get('/api/stream/fakeauth/mystream')
			.then((res) => {
				return res;
			});

		const res = await chai
			.request(app)
			.get(`/api/stream/${stream.body._id}`)
			.then((res) => {
				return res;
			});

		// Console.log(res.body);

		//Check no stream case
		chai.expect(res.body).to.be.an('object');
		chai.expect(Object.keys(res.body).length).to.equal(6);
		chai.expect(res.body._id).to.equal(stream.body._id);
		chai.expect(res.body.title).to.equal(streamInfo.title);
		chai.expect(res.body.thumbnail).to.equal(streamInfo.thumbnail);
		chai.expect(res.body.description).to.equal(streamInfo.description);
		chai.expect(res.body.status).to.equal('OFFLINE');
		chai.expect(res.body.author).to.equal('umessuti');
	});

	it('Check GET (Public streams empty) request', async () => {
		const res = await chai
			.request(app)
			.get('/api/stream/public')
			.then((res) => {
				return res;
			});

		// Console.log(res.body);

		//Check no stream case
		chai.expect(res.body).to.be.an('array');
		chai.expect(res.body.length).to.equal(0);
	});

	it('Check GET (Private streams empty) request', async () => {
		const res = await chai
			.request(app)
			.get('/api/stream/fakeauth/private')
			.then((res) => {
				return res;
			});

		// Console.log(res.body);

		//Check no stream case
		chai.expect(res.body).to.be.an('array');
		chai.expect(res.body.length).to.equal(1);
	});

	it('Start a stream', async () => {
		const stream = await chai
			.request(app)
			.get('/api/stream/fakeauth/mystream')
			.then((res) => {
				return res;
			});

		const pathToFile = 'tests/video/';
		pushStream(stream.body.streamkey, pathToFile);

		await new Promise((resolve) => setTimeout(resolve, 1000));
	});

	it('Check GET (Private streams with stream) request', async () => {
		const res = await chai
			.request(app)
			.get('/api/stream/fakeauth/private')
			.then((res) => {
				return res;
			});

		// Console.log(res.body);

		//Check no stream case
		chai.expect(res.body).to.be.an('array');
		chai.expect(res.body.length).to.equal(1);
	});

	it('Check GET (Public streams with stream) request', async () => {
		const updateStream = {
			title: 'Updated stream title',
			thumbnail: 'http://this.is.a.link.updated',
			description: 'Updated stream description',
			type: 'PUBLIC',
			invited: [],
		};

		await chai
			.request(app)
			.post('/api/stream/fakeauth/update')
			.set('content-type', 'application/json')
			.send(updateStream);

		const res = await chai
			.request(app)
			.get('/api/stream/public')
			.then((res) => {
				return res;
			});

		// Console.log(res.body);

		//Check no stream case
		chai.expect(res.body).to.be.an('array');
		chai.expect(res.body.length).to.equal(1);
	});

	it('Check GET (Stream index.m3u8) request', async () => {
		const axios = require('axios');

		const stream = await chai
			.request(app)
			.get('/api/stream/fakeauth/mystream')
			.then((res) => {
				return res;
			});

		await axios
			.get(`http://localhost:3000/api/stream/${stream.body._id}/index.m3u8`)
			.then(({ data }) => {
				return data;
			});

		await axios.get(`http://localhost:3000/-/healthz`).then(({ data }) => {
			return data;
		});
		await axios.get(`http://localhost:3000/-/ready`).then(({ data }) => {
			return data;
		});
		await new Promise((resolve) => setTimeout(resolve, 5000));

		const res = await axios
			.get(`http://localhost:3000/api/stream/${stream.body._id}/index.m3u8`)
			.then(({ data }) => {
				return data;
			});

		chai.expect(res).to.be.an('string');
	});

	it('Check DELETE (My stream) request', async () => {
		const res = await chai
			.request(app)
			.delete('/api/stream/fakeauth/mystream')
			.then((res) => {
				return res;
			});

		// Console.log(res.text);

		chai.expect(res.text).to.be.an('string');
		chai.expect(res.text).to.equal('Stream deleted successfully');

		await new Promise((resolve) => setTimeout(resolve, 5000));
	});
});
