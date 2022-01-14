import * as socketIoClient from 'socket.io-client';
import { encryptString } from '../../src/utils/crypto';


export class WebSocketClient{
	socket: socketIoClient.Socket;
	userId: string;
	userIdEncrypted: string;

	constructor(userId: string, uri: string){
		this.userId = userId;
		this.userIdEncrypted = encryptString(userId);

		this.socket = socketIoClient.io(uri, {
			path: '/socket.io',
			extraHeaders: { Authorization: 'Test ' + this.userId}
		});
	}

	getSocket(){
		return this.socket;
	}

	getUserIdEncrypted(){
		return this.userIdEncrypted;
	}

	getUserId(){
		return this.userId;
	}

	startClient() {
		this.socket.on('chat_message', data => {
			console.log(data);
		});

		this.socket.on('message_format_error', data => {
			console.log(data);
		});

	}


	sendMessageClient(receiverIdEncrypted: string, message: string){
		const sendMessage = {
			receiverId: receiverIdEncrypted,
			message: message
		};

		this.socket.emit('post', sendMessage);
	}

	chatHistoryRequest(userIdEnc: string){
		const data = {
			userId: userIdEnc
		};

		const res = this.socket.emit('get', data, (res: any) => {
			console.log(res);
			return res;
		});
		return res;
	}

	chatOverviewRequest(){
		return this.socket.emit('chat_overview', {}, (res: any) => {
			console.log(res);
			return res;
		});
	}

	async resolveUsernameRequest(username: string){
		const data = {
			username: username
		};

		this.socket.emit('resolve_username', data, (res: any) => {
			console.log(res);
		});
	}
}