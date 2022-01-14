// Load env from .env
require('dotenv').config();

const chai = require('chai');
const axios = require('axios');
const express = require('express');
const connectionDB = require('./streaming-service/tests/db/mock-db');
const chaiHttp = require('chai-http');
const streamingService = require('./streaming-service/streaming-service');
const streamingServiceEdge = require('../src/streaming-service-edge');

const pushStream = require('./streaming-service/tests/video/pushStream');
// Await new Promise((resolve) => setTimeout(resolve, 10000));

const appEdge = express();
const appMain = express();
chai.use(chaiHttp);

const streamingServiceEdgeURI = 'http://localhost:4000';

describe('Endpoint tests', () => {
	before(async function () {
		const dbUri = await connectionDB();
		streamingService(appMain, dbUri, 3000, true);
		streamingServiceEdge(appEdge, 4000);
		await new Promise((resolve) => setTimeout(resolve, 1000));
	});

	it('Check GET (service status) request', async () => {
		const res = await chai
			.request(appEdge)
			.get('/api/stream')
			.then((res) => {
				return res;
			});

		//Check the streaming service default response
		chai.expect(res.body).to.be.an('object');
		chai
			.expect(res.body)
			.to.have.property('name')
			.that.is.equal('streaming-service-edge');
		chai.expect(res.body).to.have.property('status').that.is.equal('OK');
		chai
			.expect(res.body)
			.to.have.property('message')
			.that.is.equal('This is the streaming service of the edge nodes');
	});

	// Check that all the requests all rerouted to the main node
	it('Check GET (My stream info - no stream) request', async () => {
		const res = await chai
			.request(appEdge)
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

		const res = await axios
			.post(streamingServiceEdgeURI + '/api/stream/fakeauth/new', newStream)
			.then(({ data }) => {
				return data;
			});

		console.log(res);

		//Check no stream case
		chai.expect(res).to.be.an('string');
		chai.expect(res).to.equal('Stream created successfully');
	});

	it('Check GET (My stream info - stream) request', async () => {
		const streamInfo = {
			title: 'New stream title',
			thumbnail: 'http://this.is.a.link',
			description: 'New stream description',
			type: 'PUBLIC',
			invited: [],
		};

		const res = await axios
			.get(streamingServiceEdgeURI + '/api/stream/fakeauth/mystream')
			.then(({ data }) => {
				return data;
			});

		// Console.log(res.body);

		//Check no stream case
		chai.expect(res).to.be.an('object');
		chai.expect(Object.keys(res).length).to.equal(10);
		chai.expect(res.title).to.equal(streamInfo.title);
		chai.expect(res.thumbnail).to.equal(streamInfo.thumbnail);
		chai.expect(res.description).to.equal(streamInfo.description);
		chai.expect(res.type).to.equal(streamInfo.type);
		chai.expect(res.invited.length).to.equal(0);
		chai.expect(res.status).to.equal('OFFLINE');
		chai.expect(res.author).to.equal('umessuti');
	});

	it('Check GET (Stream info) request', async () => {
		const streamInfo = {
			title: 'New stream title',
			thumbnail: 'http://this.is.a.link',
			description: 'New stream description',
			type: 'PUBLIC',
			invited: [],
		};

		const stream = await await axios
			.get(streamingServiceEdgeURI + '/api/stream/fakeauth/mystream')
			.then(({ data }) => {
				return data;
			});

		const res = await axios
			.get(streamingServiceEdgeURI + `/api/stream/${stream._id}`)
			.then(({ data }) => {
				return data;
			});

		//Check no stream case
		chai.expect(res).to.be.an('object');
		chai.expect(Object.keys(res).length).to.equal(6);
		chai.expect(res._id).to.equal(stream._id);
		chai.expect(res.title).to.equal(streamInfo.title);
		chai.expect(res.thumbnail).to.equal(streamInfo.thumbnail);
		chai.expect(res.description).to.equal(streamInfo.description);
		chai.expect(res.status).to.equal('OFFLINE');
		chai.expect(res.author).to.equal('umessuti');
	});

	it('Check POST (Update Stream) request', async () => {
		const newStream = {
			title: 'Updated stream title',
			thumbnail: 'http://this.is.a.link.updated',
			description: 'Updated stream description',
			type: 'PRIVATE',
			invited: ['umessuti'],
		};

		const res = await axios
			.post(streamingServiceEdgeURI + '/api/stream/fakeauth/update', newStream)
			.then(({ data }) => {
				return data;
			});

		//Check no stream case
		chai.expect(res).to.be.an('string');
		chai.expect(res).to.equal('Info updated successfully');
	});

	it('Check GET (My stream info - stream) request', async () => {
		const streamInfo = {
			title: 'Updated stream title',
			thumbnail: 'http://this.is.a.link.updated',
			description: 'Updated stream description',
			type: 'PRIVATE',
			invited: ['umessuti'],
		};

		const res = await axios
			.get(streamingServiceEdgeURI + '/api/stream/fakeauth/mystream')
			.then(({ data }) => {
				return data;
			});

		chai.expect(res).to.be.an('object');
		chai.expect(Object.keys(res).length).to.equal(10);
		chai.expect(res.title).to.equal(streamInfo.title);
		chai.expect(res.thumbnail).to.equal(streamInfo.thumbnail);
		chai.expect(res.description).to.equal(streamInfo.description);
		chai.expect(res.type).to.equal(streamInfo.type);
		chai.expect(res.invited.length).to.equal(1);
		chai.expect(res.status).to.equal('OFFLINE');
		chai.expect(res.author).to.equal('umessuti');
	});

	it('Check GET (My stream info - AUTH) request', async () => {
		const res = await chai
			.request(appEdge)
			.get('/api/stream/auth/mystream')
			.then((res) => {
				return res;
			});
	});

	it('Check GET (Stream info) request', async () => {
		const streamInfo = {
			title: 'Updated stream title',
			thumbnail: 'http://this.is.a.link.updated',
			description: 'Updated stream description',
			type: 'PRIVATE',
			invited: ['umessuti'],
		};

		const stream = await axios
			.get(streamingServiceEdgeURI + '/api/stream/fakeauth/mystream')
			.then(({ data }) => {
				return data;
			});

		const res = await axios
			.get(streamingServiceEdgeURI + `/api/stream/${stream._id}`)
			.then(({ data }) => {
				return data;
			});

		// Console.log(res.body);

		//Check no stream case
		chai.expect(res).to.be.an('object');
		chai.expect(Object.keys(res).length).to.equal(6);
		chai.expect(res._id).to.equal(stream._id);
		chai.expect(res.title).to.equal(streamInfo.title);
		chai.expect(res.thumbnail).to.equal(streamInfo.thumbnail);
		chai.expect(res.description).to.equal(streamInfo.description);
		chai.expect(res.status).to.equal('OFFLINE');
		chai.expect(res.author).to.equal('umessuti');
	});

	it('Check GET (Public streams empty) request', async () => {
		const res = await axios
			.get(streamingServiceEdgeURI + '/api/stream/public')
			.then(({ data }) => {
				return data;
			});
		// Console.log(res.body);

		//Check no stream case
		chai.expect(res).to.be.an('array');
		chai.expect(res.length).to.equal(0);
	});

	it('Check GET (Private streams empty) request', async () => {
		const res = await axios
			.get(streamingServiceEdgeURI + '/api/stream/fakeauth/private')
			.then(({ data }) => {
				return data;
			});
		// Console.log(res.body);

		//Check no stream case
		chai.expect(res).to.be.an('array');
		chai.expect(res.length).to.equal(0);
	});

	it('Start a stream', async () => {
		const stream = await axios
			.get(streamingServiceEdgeURI + '/api/stream/fakeauth/mystream')
			.then(({ data }) => {
				return data;
			});

		const pathToFile = 'tests/streaming-service/tests/video/';
		pushStream(stream.streamkey, pathToFile);

		await new Promise((resolve) => setTimeout(resolve, 1000));
	});

	it('Check GET (Private streams with stream) request', async () => {
		const res = await axios
			.get(streamingServiceEdgeURI + '/api/stream/fakeauth/private')
			.then(({ data }) => {
				return data;
			});

		// Console.log(res.body);

		//Check no stream case
		chai.expect(res).to.be.an('array');
		chai.expect(res.length).to.equal(1);
	});

	it('Check GET (Public streams with stream) request', async () => {
		const updateStream = {
			title: 'Updated stream title',
			thumbnail: 'http://this.is.a.link.updated',
			description: 'Updated stream description',
			type: 'PUBLIC',
			invited: [],
		};

		await axios.post(
			streamingServiceEdgeURI + '/api/stream/fakeauth/update',
			updateStream
		);

		const res = await axios
			.get(streamingServiceEdgeURI + '/api/stream/public')
			.then(({ data }) => {
				return data;
			});

		// Console.log(res.body);

		//Check no stream case
		chai.expect(res).to.be.an('array');
		chai.expect(res.length).to.equal(1);
	});

	it('Check GET (Stream index.m3u8) request', async () => {
		const stream = await axios
			.get(streamingServiceEdgeURI + '/api/stream/fakeauth/mystream')
			.then(({ data }) => {
				return data;
			});

		const res = await axios
			.get(streamingServiceEdgeURI + `/api/stream/${stream._id}/index.m3u8`)
			.then(({ data }) => {
				return data;
			});

		chai.expect(res).to.be.an('string');
		// Console.log(res);
	});

	it('Check DELETE (My stream) request', async () => {
		const res = await axios
			.delete(streamingServiceEdgeURI + `/api/stream/fakeauth/mystream`)
			.then(({ data }) => {
				return data;
			});

		// Console.log(res);

		chai.expect(res).to.be.an('string');
		chai.expect(res).to.equal('Stream deleted successfully');
	});

	it('Check GET (Stream index.m3u8) request', async () => {
		const res = await axios
			.get(streamingServiceEdgeURI + `/api/stream/inexistentStream/index.m3u8`)
			.then(({ data }) => {
				return data;
			})
			.catch((err) => {
				return err.response.status;
			});

		axios.get(streamingServiceEdgeURI + `/-/ready`).then(({ data }) => {
			return data;
		});
		axios.get(streamingServiceEdgeURI + `/-/healthz`).then(({ data }) => {
			return data;
		});
		await new Promise((resolve) => setTimeout(resolve, 5000));

		chai.expect(res).to.be.an('number');
		chai.expect(res).to.equal(404);
	});
});
