import * as socketIoClient from 'socket.io-client';
import { encryptString } from '../utils/crypto';


export class TestWebSocketClient{
	socket: socketIoClient.Socket;
	userId: string;
	userIdEncrypted: string;
    //target: string;

	constructor(uri: string, userId: string, local: boolean){
		this.userId = userId;
		this.userIdEncrypted = encryptString(userId);

		if (local){
			this.socket = socketIoClient.io(uri, {
				extraHeaders: { Authorization: 'Test ' + this.userId}
			});
		}else{
			this.socket = socketIoClient.io(uri, {
				path: "/api/chat-service/socket.io",
				extraHeaders: { Authorization: 'Test ' +  this.userId}
			});
		}
		
	}

    //Getter
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