/* eslint-disable */
import * as chai from 'chai';
import * as express from 'express';
import { io as Client, Socket } from 'socket.io-client';
import chaiHttp = require('chai-http');
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { AxiosActions, AxiosMockActions } from '../src/utils/axios-implementations';
import { main } from '../src/chat-service';
import { Message } from '../src/model/Message';
import { decryptMessage } from '../src/utils/crypto';
import { MockedChatService, MockedUserNodeService } from '../src/utils/mocked-services';

chai.use(chaiHttp);
const app = express();


describe('service', function() {
	let client1: Socket<DefaultEventsMap, DefaultEventsMap>, client2: Socket<DefaultEventsMap, DefaultEventsMap>;
	let app1: express.Express, app2: express.Express;
	let axios1: AxiosActions, axios2: AxiosActions;
	let mockedChatService: MockedChatService, mockedUserNodeService: MockedUserNodeService;

	before(function() {
		mockedChatService = new MockedChatService();
		mockedUserNodeService = new MockedUserNodeService();
		app1 = express();
		app2 = express();
		axios1 = new AxiosMockActions('ip1', mockedUserNodeService, mockedChatService);
		axios2 = new AxiosMockActions('ip2', mockedUserNodeService, mockedChatService);
		main(app1, axios1, '14001');
		main(app2, axios2, '14002');

		client1 = Client('http://localhost:14001', { extraHeaders: { authorization: 'Bearer client1' } });
		client2 = Client('http://localhost:14002', { extraHeaders: { authorization: 'Bearer client2' } });
	});

	it('client2 should resolve client1 userId', function(done) {
		client2.emit('resolve_username', {
			username: 'client1'
		},
		(res: any) => {
			chai.expect(res.userId).to.be.a('string');
			chai.expect(res.username).to.equal('client1');
			done();
		});
	});

	it('client1 should receive a message', function(done) {
		client1.on('chat_message', (message: Message) => {
			chai.expect(message.message).to.equal('message number 1');
			chai.expect(message.senderId).to.be.a('string');
			chai.expect(message.receiverId).to.be.a('string');
			done();         
		});
		
		client2.emit('resolve_username', {
			username: 'client1'
		},
		(res: any) => {
			const receiverDigest = res.userId;
			client2.emit('post', {
				receiverId: receiverDigest,
				message: 'message number 1'
			});
		});
	});

	it('client1 should receive chat overview', function(done) {
		client2.emit('chat_overview', {},
		(res: any) => {
			chai.expect(res).to.not.have.property('error');
			done();
		});
	});

	it('client1 should receive chat history', function(done) {
		client2.emit('resolve_username', { username: 'client1'}, (res: any) => {
			client2.emit('get', {
				userId: res.userId
			},
			(res1: any) => {
				chai.expect(res1).to.not.have.property('error');
				done();
			});
		});
	});
});
/* eslint-enable */
