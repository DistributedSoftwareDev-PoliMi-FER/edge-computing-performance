import * as socketIo from 'socket.io';
import { Message } from '../model/message';
import * as chatHistoryService from '../services/chat-history-service';
import { userIdToUsername, usernameToId } from '../utils/auth0-api';
import { checkJWT } from '../utils/authentication-service';
import { decryptMessage, encryptMessage, encryptString, decryptString} from '../utils/crypto';
import { STRESS_TESTING, TESTING } from '../utils/global-value';



export async function onConnect(ws: socketIo.Socket){
	await checkLogin(ws);

	ws.on('get', (data: any, callback) => {
		getChatHistory(data, ws, callback);
	});
	ws.on('post', (message: any) => {
		postMessage(message, ws);
	});
	ws.on('chat_overview', (data: any, callback) => {
		chatOverview(ws, callback);
	});
	ws.on('resolve_username', (data: any, callback) => {
		resolveUsername(data, callback);
	});
	ws.on('disconnect', () => {
		disconnect(ws);
	});

}


// This function check the login with the token and put the websocket of the user in a room with his name
async function checkLogin(ws: socketIo.Socket) {
	console.log('function: checkLogin ');
	//Console.log(ws.handshake.headers.authorization);

	if(ws.handshake.headers.authorization?.split(' ')[0] === 'Bearer'){
		const token = ws.handshake.headers.authorization?.split(' ')[1];
		
		const authorizedUserId = await checkJWT(token);

		//Ws.handshake.auth = {[key: authorizedUserId]: any};
		//Console.log(ws.handshake);

		if(authorizedUserId === 'FORBIDDEN'){
			console.log('invalid token => disconnected from server');
			ws.emit('connection_report', 'authentication error: invalid token');
			ws.disconnect(); 
		}
		else {
			ws.emit('connection_report', 'successfully connected with a valid token');
			console.log('userId is connected with a valide token: ' + authorizedUserId);
			
			try {
				const username = await userIdToUsername(authorizedUserId);
				ws.data.userId = authorizedUserId;
				ws.data.username = username;
				console.log('username of ' + authorizedUserId + ' is:'  + username);
				ws.join(authorizedUserId);
			}
			catch (err){
				console.log(err);
			}
			
		}

	}
	else if(ws.handshake.headers.authorization?.split(' ')[0] === 'Test' && TESTING === 1){  //This else is for the testing. For use this beafore starting the service we have to modify the testing value in globals
		console.log('you are in testing');
		const userId = ws.handshake.headers.authorization?.split(' ')[1];
		ws.emit('connection_report', 'successfully connected for testing');

		let username = '';
		if(STRESS_TESTING === 1){
			username = userId;
		}
		else {
			try {
				username = await userIdToUsername(userId);
			}
			catch (err){
				console.log(err);
			}
			
		}
		
		console.log(username);
		ws.data.userId = userId;
		ws.data.username = username;
		console.log('username of ' + userId + ' is:'  + username);
		ws.join(userId);

	}
	else {
		console.log('error token');
		ws.disconnect();
	}
	
}

// This function manage the response to a get (history) event recived in a websocket
async function getChatHistory(userIdJson: any, ws: socketIo.Socket, callback: any) {
	console.log('function: get (chat history) ' + 'from ' + ws.data.userId);
	try {
		if(userIdJson.userId !== undefined){
			const userId = userIdJson.userId;
			const userIdDecrypt = decryptString(userId);
			//Console.log(userIdDecrypt);
			const historyJson = await chatHistoryService.getHistoryChat(ws.data.userId, userIdDecrypt);
			// Encrypt all the userId of the chat history and add also the clear username of the users;
			if(historyJson === 'NO HISTORY'){
				
				callback('no history found');
			}
			else {
				//Console.log(historyJson);
				const historyWithUsername = await addUserIdEnc(historyJson);
				//Console.log(historyWithUsername);
				callback(historyWithUsername);
			}
		}
		else {
			callback('invalid request format');
		}
		
	}
	catch (error: any){
		console.log(error.message);
		callback(error.message);
	}
}

// This function manage the post (message) event recived in a websocket. This function sends to the receiver the message.
async function postMessage(messageJson: Message, ws: socketIo.Socket) {
	console.log('function: post ' + 'from ' + ws.data.userId);
	try {
		const messageDate = new Date(Date.now());

		//Console.log(messageJson);
		let message: Message;

		message = Message.validate(messageJson);

		// Decrypt the message, since the client sends an ecrypted version of the receiverId
		message = decryptMessage(message);

		message.senderId = ws.data.userId;
		
		//Console.log('message is: ');
		//console.log(message);
		
		chatHistoryService.chatHistoryUpdate(message, messageDate);

		let messageToSend: any = new Message(message.senderId, message.receiverId, message.message);
		
		messageToSend = encryptMessage(messageToSend);

		messageToSend.date = messageDate;
		messageToSend.senderUsername = ws.data.username;

		//Console.log('send message to ' + message.receiverId + ' from: ' + ws.data.username);
		ws.to(message.receiverId).emit('chat_message', messageToSend);
	}
	catch (err){
		//Console.log('in post: ' +  err);
		ws.emit('message_format_error');
		return;
	}
}


//This function responses to the first chat overview request with a callback
async function chatOverview(ws: socketIo.Socket, callback: any){
	console.log('function: chat overview ' + 'from ' + ws.data.userId);
	try {
		const chatHistory = await chatHistoryService.getHistoryChatOfOneUser(ws.data.userId);

		if(chatHistory === 'NO HISTORY'){
				
			callback('no history found');
		}
		else {
			//Console.log(historyJson);
			const chatOverview = await createChatOverViewFromChatHistory(chatHistory, ws.data.userId);

			callback(chatOverview);
		}
		
	}
	catch (err){
		callback(err);
	}
	
}

//This function responses to a resolve_username event recived in a websocket. If the username exist sent to the relative userId of the username.  
async function resolveUsername(usernameJson: any, callback: any){
	//Validate the object
	console.log('function: resolve username');
	
	//Console.log(usernameJson.username);
	
	if(usernameJson.username !== undefined && usernameJson.username !== ''){
		const username: string = usernameJson.username;

		try {
			const userId = await usernameToId(username);

			//Console.log('username is: ' + username);
			//Console.log('userId is: ' + userId);
			const obj = { username: username, userId: encryptString(userId)};
			callback(obj);
		}
		catch (err: any){
			//Console.log('username not found');
			//console.log(err.message);
			callback(err.message);
		}
	}
	else {
		callback('invalid input');
	}
}


// This function notify the disconnection of an user
async function disconnect(ws: socketIo.Socket) {
	console.log(ws.data.userId + 'is disconnected');
}

//This function create a chat overview from a chat history
async function createChatOverViewFromChatHistory(history: any, userId: string){
	try {
		//Console.log(userId);
	//console.log(history.length);
		const chatOverview = [];

		for(let i = 0; i < history.length; i++){
			let usernameTmp = '';
			let userIdTmp = '';
			if(history[i].users[0].userId === userId){
				usernameTmp = await userIdToUsername(history[i].users[1].userId);
				userIdTmp = encryptString(history[i].users[1].userId); 
			}
			else if(history[i].users[1].userId === userId){
				usernameTmp = await userIdToUsername(history[i].users[0].userId);
				userIdTmp = encryptString(history[i].users[0].userId);
			}

			const lastMessage = history[i].history[history[i].history.length - 1];

			const obj = {username: usernameTmp, userId: userIdTmp, lastMessage: lastMessage.message, date: lastMessage.timeAndData};

			chatOverview.push(obj);
		}

		return chatOverview;
	}
	catch (err){
		console.log(err);
	}
	
}

// This function trasforms the chat history to the object to sent to the client
async function addUserIdEnc(history: any) {
	try {
		delete history[0]._id;
		delete history[0].__v;

		history[0].users[0].username = await userIdToUsername(history[0].users[0].userId);
		history[0].users[0].userId = encryptString(history[0].users[0].userId);
			

		history[0].users[1].username = await userIdToUsername(history[0].users[1].userId);
		history[0].users[1].userId = encryptString(history[0].users[1].userId);

		return history;
	}
	catch (err){
		console.log(err);
	}
	
}
