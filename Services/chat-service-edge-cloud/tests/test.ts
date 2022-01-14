import * as chai from 'chai';
import * as express from 'express';
import * as chatService from '../src/chat-service';
import * as db from '../src/db/db-access';
import { connectionDB } from './db/mock-db';
import chaiHttp = require('chai-http');

const app = express();
const port = process.env.HTTP_PORT;
chai.use(chaiHttp);

describe('Endpoint tests', () => {
	before(async function() {
		const uri = await connectionDB();
		chatService.startChatEdgeNodeService(app, uri, 3000);
	});

	// First POST test
	it(('Check first POST of a first message of a chat'), async() => {
		return await chai.request(app)
			.post('/')
			.set('content-type', 'application/json')
			.send({
				senderId: 'auth0|61b4bab8c3f245006c2993ee',
				receiverId: 'auth0|61b5caef20680d00696c67d2',
				message: 'Hi, this is the first message',
				date: new Date(Date.now())
			})
			.then(async res => {
				chai.expect(res).to.have.status(200);
				const chatHistory: any = await db.findChatHistoryforTwo('auth0|61b4bab8c3f245006c2993ee', 'auth0|61b5caef20680d00696c67d2');
                
				//Check the format of the object chat history
				chai.expect(chatHistory).to.be.an('array');
				chai.expect(chatHistory[0]).to.have.property('users');
				chai.expect(chatHistory[0]).to.have.property('history');
				chai.expect(chatHistory[0].users).to.be.an('array');
				chai.expect(chatHistory[0].users.length).to.equal(2);
				chai.expect(chatHistory[0].history).to.be.an('array');
				chai.expect(chatHistory[0].history.length).to.equal(1);
                
                
				// Verifies that the post request have saved the object properly in the db
				chai.expect(chatHistory[0].users[0]).to.deep.equal({ userId: 'auth0|61b4bab8c3f245006c2993ee', id: 0 }),
				chai.expect(chatHistory[0].users[1]).to.deep.equal({ userId: 'auth0|61b5caef20680d00696c67d2', id: 1 }),
				chai.expect(chatHistory[0].history[0].senderPos).to.equal(0);
				chai.expect(chatHistory[0].history[0]).to.have.property('timeAndData');
				chai.expect(chatHistory[0].history[0].message).to.equal('Hi, this is the first message');
			});
	});

	it(('Check second POST of a second message of a chat'),  async() => {
		await chai.request(app)
			.post('/')
			.set('content-type', 'application/json')
			.send({
				senderId: 'auth0|61b5caef20680d00696c67d2',
				receiverId: 'auth0|61b4bab8c3f245006c2993ee',
				message: 'Hi, this is the second message',
				date: new Date(Date.now())
			})
			.then(res => {
				chai.expect(res).to.have.status(200);
            
			});

		const chatHistory: any = await db.findChatHistoryforTwo('auth0|61b5caef20680d00696c67d2', 'auth0|61b4bab8c3f245006c2993ee');
        
		//Check the format of the object chat history in the db
		chai.expect(chatHistory).to.be.an('array');
		chai.expect(chatHistory[0]).to.have.property('users');
		chai.expect(chatHistory[0]).to.have.property('history');
		chai.expect(chatHistory[0].users).to.be.an('array');
		chai.expect(chatHistory[0].users.length).to.equal(2);
		chai.expect(chatHistory[0].history).to.be.an('array');
		chai.expect(chatHistory[0].history.length).to.equal(2);
        
        
		// Verifies that the post request have saved the object properly in the db
		chai.expect(chatHistory[0].users[0]).to.deep.equal({ userId: 'auth0|61b4bab8c3f245006c2993ee', id: 0 }),
		chai.expect(chatHistory[0].users[1]).to.deep.equal({ userId: 'auth0|61b5caef20680d00696c67d2', id: 1 }),
		chai.expect(chatHistory[0].history[1].senderPos).to.equal(1);
		chai.expect(chatHistory[0].history[1]).to.have.property('timeAndData');
		chai.expect(chatHistory[0].history[1].message).to.equal('Hi, this is the second message');
		return;
	});

	it(('Check GET (chat history) request'), async() => {
		const res = await chai.request(app)
			.get('/chatHistory/')
			.query({
				userOneId: 'auth0|61b5caef20680d00696c67d2',
				userTwoId: 'auth0|61b4bab8c3f245006c2993ee'
			})
			.then(res => {
				return res;
			});
        
		//Check the format of the object in the get chat history response
		const chatHistory: any = await db.findChatHistoryforTwo('auth0|61b5caef20680d00696c67d2', 'auth0|61b4bab8c3f245006c2993ee');
            
		//Check the format of response chat history
		chai.expect(res.body).to.be.an('array');
		//Check the format of users
		chai.expect(res.body[0]).to.have.property('users').that.is.an('array');
		chai.expect(res.body[0].users[0]).to.have.property('username').that.is.a('string');
		chai.expect(res.body[0].users[0]).to.have.property('userId').that.is.a('string');
		chai.expect(res.body[0].users[1]).to.have.property('username').that.is.a('string');
		chai.expect(res.body[0].users[1]).to.have.property('userId').that.is.a('string');
		//Check the format of history
		chai.expect(res.body[0]).to.have.property('history').that.is.a('array');
		chai.expect(res.body[0].history.length).to.equal(2);
		chai.expect(res.body[0].history[0].message).to.equal('Hi, this is the first message');
		chai.expect(res.body[0].history[1].message).to.equal('Hi, this is the second message');
	});

	it(('Check GET (chat overview) request'), async() => {
		const res = await chai.request(app)
			.get('/chatOverview/')
			.query({
				userId: 'auth0|61b5caef20680d00696c67d2'
			})
			.then(res => {
				return res;
			});

		//Check the format of the object in the get chat overview response
		const chatHistory: any = await db.findChatHistoryforTwo('auth0|61b5caef20680d00696c67d2', 'auth0|61b4bab8c3f245006c2993ee');
            
		//Check the format of response chat overview
		chai.expect(res.body).to.be.an('array');
		chai.expect(res.body.length).to.equal(1);
		//Check the format of chat overview 
		chai.expect(res.body[0]).to.have.property('username').that.is.a('string');
		chai.expect(res.body[0]).to.have.property('userId').that.is.a('string');
		chai.expect(res.body[0]).to.have.property('lastMessage').that.is.a('string');
		chai.expect(res.body[0]).to.have.property('date');
		chai.expect(res.body[0].lastMessage).to.equal('Hi, this is the second message');
	});

	it(('Check GET (chat history) request with error'), async() => {
		const res = await chai.request(app)
			.get('/chatHistory/')
			.query({
				userOneId: 'auth0|61b5caef20680d00696c67d2',
				userTwoId: 'auth0|61b75004d27de7006ab94b86'
			})
			.then(res => {
				return res;
			});

		//Check the format of the error
		chai.expect(res.body).to.have.property('statusCode').that.is.equal(404);
		chai.expect(res.body).to.have.property('service').that.is.equal('chat service');
		chai.expect(res.body).to.have.property('code');
		chai.expect(res.body).to.have.property('message').that.is.a('string');
		chai.expect(res.body.message).to.equal('Cannot find this chat history of auth0|61b5caef20680d00696c67d2 and auth0|61b75004d27de7006ab94b86');
	});

	it(('Check GET (chat overview) request with error'), async() => {
		const res = await chai.request(app)
			.get('/chatOverview/')
			.query({
				userId: 'auth0|61b75004d27de7006ab94b86'
			})
			.then(res => {
				return res;
			});

		//Check the format of the error
		chai.expect(res.body).to.have.property('statusCode').that.is.equal(404);
		chai.expect(res.body).to.have.property('service').that.is.equal('chat service');
		chai.expect(res.body).to.have.property('code');
		chai.expect(res.body).to.have.property('message').that.is.a('string');
		chai.expect(res.body.message).to.equal('Cannot find this chat overview of auth0|61b75004d27de7006ab94b86');
	});

	it(('Check GET (chat overview) request with error'), async() => {
		const res = await chai.request(app)
			.get('/chatOverview/')
			.query({
				usId: 'ffffff'
			})
			.then(res => {
				return res;
			});

		//Check the format of the error
		chai.expect(res.body).to.have.property('statusCode').that.is.equal(404);
		chai.expect(res.body).to.have.property('service').that.is.equal('chat service');
		chai.expect(res.body).to.have.property('code');
		chai.expect(res.body).to.have.property('message').that.is.a('string');
		chai.expect(res.body.message).to.equal('userId is missing');
	});

    
	it(('Check GET (chat history) request with error'), async() => {
		const res = await chai.request(app)
			.get('/chatHistory/')
			.query({
				userId: 'zzz',
				userTwoId: 'auth0|61b75004d27de7006ab94b86'
			})
			.then(res => {
				return res;
			});

		//Check the format of the error
		chai.expect(res.body).to.have.property('statusCode').that.is.equal(404);
		chai.expect(res.body).to.have.property('service').that.is.equal('chat service');
		chai.expect(res.body).to.have.property('code');
		chai.expect(res.body).to.have.property('message').that.is.a('string');
		chai.expect(res.body.message).to.equal('userOneId or/and userTwoId is/are missing');
	});
});