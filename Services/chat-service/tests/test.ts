import * as express from 'express';
import * as http from 'http';
import * as chai from 'chai';
import {startChatCloudService} from '../src/chat-service';
import { changeAut0Token, isTesting } from '../src/utils/global-value';
import { WebSocketClient } from './client/wsClient';
import { connectionDB } from './db/mock-db';
import * as db from '../src/db/db-access';
import { getAuth0Token } from '../src/utils/auth0-api';

const app = express();
const server = http.createServer(app);
let httpServerAddress: any;


describe('Tests', () => {
	let clientOne: WebSocketClient;
	let clientTwo: WebSocketClient;
	before(async() => {
		// Create the mock database and start the service
		const uri = await connectionDB();
		getAuth0Token().then(res => {
			isTesting();
			startChatCloudService(server, app, uri, 3000);
			httpServerAddress = server.address();
			console.log(httpServerAddress);
			changeAut0Token(res);
		});
	});

   
	it(('prova'), done => {
		// The username of this client stefoss98
		clientOne = new WebSocketClient('auth0|61b4bab8c3f245006c2993ee', 'http://localhost:3000');
		clientOne.getSocket().on('connection_report', res => {
			chai.expect(res).to.be.a('string');
			chai.expect(res).to.equal('successfully connected for testing');
			//Console.log(res);
			done();
		});
	});

	it(('prova'), done => {
		//  Stetris
		clientTwo = new WebSocketClient('auth0|61b5caef20680d00696c67d2', 'http://localhost:3000');
		clientTwo.getSocket().on('connection_report', res => {
			chai.expect(res).to.be.a('string');
			chai.expect(res).to.equal('successfully connected for testing');
			//Console.log(res);
			done();
		});
	});

	it(('[get EVENT] Check that the request of an empty history returns an history not fuond'), done => {
		const request = {
			userId: clientTwo.getUserIdEncrypted()
		};
		setTimeout(() => {
			clientOne.getSocket().emit('get', request, (data: any) => {
				console.log(data);
    
				chai.expect(data).to.equal('no history found');
				done();
			});
		}, 1000);
        
	});

	it(('[get EVENT] Check that the wrong format request returns an invalid format error'), done => {
		const request = {
			usId: clientTwo.getUserIdEncrypted()
		};

		clientOne.getSocket().emit('get', request, (data: any) => {
			console.log(data);

			chai.expect(data).to.equal('invalid request format');
			done();
		});
	});
    
	//This is a test in which clientOne sends a message to clientTwo
	it(('[POST EVENT] Check that the two users can communicate between themself (FIRST MESSAGE'), done => {
        
		const message = {
			receiverId: clientTwo.getUserIdEncrypted(),
			message: 'ciao come stai'
		};
        
		clientTwo.getSocket().on('chat_message', res => { 
			console.log(res);

			//Check that the message received is correct
			chai.expect(res.message).to.equal(message.message);
			chai.expect(res.senderUsername).to.equal('stefoss98');
			chai.expect(res).to.have.property('senderId').that.is.a('string');
			chai.expect(res.senderId).to.equal(clientOne.getUserIdEncrypted());
			chai.expect(res).to.have.property('receiverId').that.is.a('string');
			chai.expect(res.receiverId).to.equal(clientTwo.getUserIdEncrypted());
			chai.expect(res).to.have.property('date').that.is.a('string');
			done();
		});

        
		setTimeout(() => {
			clientOne.getSocket().emit('post', message); 
		}, 1000);

		setTimeout(() => {
			console.log('wait for the post');
		}, 2000);
        
        
	});

	it(('Check that the first message is correctly saved in the db'), async() => {

		const chatHistory: any = await db.findChatHistoryforTwo(clientTwo.getUserId(), clientOne.getUserId());

		console.log(chatHistory.users);
		console.log(chatHistory.history);
		//Check the format of the object chat history in the db
		chai.expect(chatHistory).to.be.an('array');
		chai.expect(chatHistory[0]).to.have.property('users');
		chai.expect(chatHistory[0]).to.have.property('history');
		chai.expect(chatHistory[0].users).to.be.an('array');
		chai.expect(chatHistory[0].users.length).to.equal(2);
		chai.expect(chatHistory[0].history).to.be.an('array');
		chai.expect(chatHistory[0].history.length).to.equal(1);
        
        
		// Verifies that the post request have saved the object properly in the db
		chai.expect(chatHistory[0].users[0]).to.deep.equal({ userId: clientOne.getUserId(), id: 0 }),
		chai.expect(chatHistory[0].users[1]).to.deep.equal({ userId: clientTwo.getUserId(), id: 1 }),
		chai.expect(chatHistory[0].history[0].senderPos).to.equal(0);
		chai.expect(chatHistory[0].history[0]).to.have.property('timeAndData');
		chai.expect(chatHistory[0].history[0].message).to.equal('ciao come stai');
		return;   
	});

	//This is a test in which clientTwo sends a message to clientOne
	it(('[post EVENT] Check that the two users can communicate between themself (SECOND MESSAGE)'),    done => {
        
		const message = {
			receiverId: clientOne.getUserIdEncrypted(),
			message: 'io bene tu?'
		};
        
		clientOne.getSocket().on('chat_message', res => { 
			console.log(res);
			chai.expect(res.message).to.equal(message.message);
			chai.expect(res.senderUsername).to.equal('stetris');
			chai.expect(res).to.have.property('senderId').that.is.a('string');
			chai.expect(res.senderId).to.equal(clientTwo.getUserIdEncrypted());
			chai.expect(res).to.have.property('receiverId').that.is.a('string');
			chai.expect(res.receiverId).to.equal(clientOne.getUserIdEncrypted());
			chai.expect(res).to.have.property('date').that.is.a('string');
			done();
		});

		setTimeout(() => {
			clientTwo.getSocket().emit('post', message); 
		}, 1000);

		setTimeout(() => {
			console.log('wait for the post');
		}, 2000);

	});
    
	it(('[get EVENT] Check that user two can get an history'), done => {
		const request = {
			userId: clientTwo.getUserIdEncrypted()
		};

		clientOne.getSocket().emit('get', request, (data: any) => {
			console.log(data);

			chai.expect(data).to.be.an('array');
			chai.expect(data[0]).to.have.property('users');
			chai.expect(data[0]).to.have.property('history');
			chai.expect(data[0].users).to.be.an('array');
			chai.expect(data[0].users.length).to.equal(2);
			chai.expect(data[0].history).to.be.an('array');
			chai.expect(data[0].history.length).to.equal(2);
			chai.expect(data[0].history[1].message).to.equal('io bene tu?');
			done();
		});
	});

	it(('[chat_overview EVENT] Check chat overview request of the clientTwo'), done => {

		clientTwo.getSocket().emit('chat_overview', {}, (data:any) => {
			console.log(data);

			chai.expect(data).to.be.an('array');
			chai.expect(data.length).to.equal(1);
			chai.expect(data[0]).to.have.property('username');
			chai.expect(data[0].username).to.equal('stefoss98');
			chai.expect(data[0]).to.have.property('userId');
			chai.expect(data[0].userId).to.equal(clientOne.getUserIdEncrypted());
			chai.expect(data[0]).to.have.property('lastMessage');
			chai.expect(data[0].lastMessage).to.equal('io bene tu?');
			chai.expect(data[0]).to.have.property('date');
			chai.expect(data[0].date).to.be.a('string');

			done();
		});
	});

	it(('[resolve_username EVENT] Check resolve_username request from clientOne'), done => {
        
		clientOne.getSocket().emit('resolve_username', {username: 'stetris'}, (data: any) => {
			console.log(data);

			chai.expect(data).to.have.property('userId');
			chai.expect(data.userId).to.equal(clientTwo.getUserIdEncrypted());
			chai.expect(data).to.have.property('username');
			chai.expect(data.username).to.equal('stetris');

			done();
		});
	});
    
});
