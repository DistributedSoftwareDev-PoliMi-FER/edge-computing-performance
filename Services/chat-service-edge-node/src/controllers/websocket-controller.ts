import * as socketIo from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Message } from '../model/Message';
import { notifyDisconnection, notifyNewConnection, retrieveChatHistory, retrieveChatOverview } from '../services/business-services';
import { socketsManager, unsentMessages } from '../chat-service';
import { AxiosActions } from '../utils/axios-implementations';
import { AUTH_SERVICE, AUTH_TOOLS, BACKUP_FIRST, CHAT_SERVICE_URL, NODE_ENV } from '../utils/global-parameters';
import { decryptMessage, decryptString, encryptString } from '../utils/crypto';


type WebSocket = socketIo.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;


let axios: AxiosActions;
// Sets the object used to send http requests to other services. It can be implemented as a mocked service for testing purposes
export function setAxiosImplementation(axiosImplementation: AxiosActions) {
	axios = axiosImplementation;
}


// Manages a new websocket conncetion of a client
export async function onConnection(ws: WebSocket) {
	const isConnected = await connect(ws);
	if(!isConnected) {
		return;
	}

	// Set event handlers
	ws.on('get', (receiverJson, callback) => {
		get(receiverJson, ws, callback);
	});
	ws.on('chat_overview', (empty, callback) => {
		chatOverview(ws, callback);
	});
	ws.on('post', message => {
		post(message, ws);
	});
	ws.on('resolve_username', (username, callback) => {
		resolveUsername(username, ws, callback);
	});
	ws.on('disconnect', () => {
		disconnect(ws);
	});
}


// Performs actions to be done when a client connects via websocket (namely auth, and tells the master node that a new user is connected)
// Return false if something went wrong
async function connect(ws: WebSocket) {
	console.log('creating websocket for new user...');
	let userId: string;
	try {
		console.log('authenticating the user...');
		const authToken = ws.handshake.headers.authorization?.split(' ')[1] as string;
		userId = await AUTH_SERVICE.authenticate(authToken) as string;
	}
	catch (err) {
		ws.disconnect();
		console.error('authentication failed (socket closed)\n\t' + err);
		return false;
	}

	ws.data.userId = userId; // Save the userId also in the socket custom data

	// Retrieve the username relative to this user
	try {
		ws.data.username = await AUTH_TOOLS.idToUsername(userId);
	}
	catch (err) {
		ws.disconnect();
		console.error("couldn't retrieve username\n\t" + err);
		return false;
	}

	try {
		await notifyNewConnection(userId); // Tell the master node about this new user
		socketsManager.add(userId, ws); // Add socket to local sockets list
	}
	catch (err) {
		ws.disconnect();
		console.error('master node cannot be notified of new connection (socket closed)\n\t' + err);
		return false;
	}


	console.log('user ' + userId + ' connected successfully');
	ws.emit('connection_report', 'success');

	return true;
}


// Fetches the chats history for the user. On error the user must retry later.
async function get(receiverJson: any, ws: WebSocket, callback: (history: any) => void) {
	console.log('chat history request received');
	try {
		const receiver = decryptString(receiverJson.userId);
		const historyJson = await retrieveChatHistory(ws.data.userId, receiver);
		callback(historyJson);
		console.log('chat history sent');
	}
	catch (err) {
		callback({error: 'history error'});
		console.error('chat history error\n\t' + err);
		return;
	}
}


// Sends an overview of the active chats for the user
async function chatOverview(ws: WebSocket, callback: (overview: any) => void) {
	console.log('chat overview request received');
	try {
		const chatOverview = await retrieveChatOverview(ws.data.userId);
		callback(chatOverview);
		console.log('chat overview sent');
	}
	catch (err) {
		callback({error: 'chat overview error'});
		console.error('chat overview error\n\t' + err);
		return;
	}
}


// Delivers the incoming message to the receiver, whether it is managed from this node or from another node. 
// Moreover sends the message to the master node in order to back it up.
// If the receiver is not connected to any node, the message won't be immediately delivered, but as soon as the receiver comes back online he can retrieve all of his messages thanks to the backup.
async function post(messageJson: any, ws: WebSocket) {
	console.log('new message received on websocket: ' + messageJson.message);
	
	// Deserialize the JSON message
	let message: Message;
	try {
		message = Message.validateWs(messageJson);
		message.senderId = ws.data.userId;
		message.senderUsername = ws.data.username;
	}
	catch (error) {
		ws.emit('message_format_error', 'Invalid message');
		console.error('websocket post message format error\n\t' + error);
		return;
	}

	try {
		message = decryptMessage(message); // Decrypt the message, since the client sends an ecrypted version of the receiverId
	}
	catch (err) {
		ws.emit('message_format_error', 'Invalid receiver'); // The receiver couldn't be decrypted
		console.error('websocket post message receiver error\n\t' + err);
		return;
	}

	if(!BACKUP_FIRST) {
		// Deliver message to final user
		await socketsManager.sendTo(message);
	}

	// Send the message to the master node for backup purposes
	try {
		console.log('notifying the chat service on the master node of the new message: ' + message.message);		
		await axios.post(CHAT_SERVICE_URL, 200, message);
	} 
	catch (error) {
		unsentMessages.add(message); // Add the message to the unsent messages list, it will be retried in the future
		console.error('message: ' + message.message + ' not backed up (will be retried later)\n\t' + error);
	}

	if(BACKUP_FIRST) {
		// Deliver message to final user
		await socketsManager.sendTo(message);
	}
}


// Translates the username into the user ID
async function resolveUsername(usernameJson: any, ws: WebSocket, callback: (resUsername: any) => void) {
	console.log('resolve username request received');
	
	try {
		const userId = await AUTH_TOOLS.usernameToId(usernameJson.username);
		callback({ username: usernameJson.username, userId: encryptString(userId) });
		console.log('resolved username sent');		
	}
	catch (err) {
		callback({error: 'username not found'});
		console.error('resolve username error\n\t' + err);		
	}		
}


// Performs all of the actions needed after a disconnection (namely removes the socket from the local users socket list and tells the master node that the user disconnected)
async function disconnect(ws: WebSocket) {
	console.log('\ndisconnecting user: ' + ws.data.userId + '\n');
	
	socketsManager.remove(ws.data.userId); // Remove socket from local sockets
	try {
		await notifyDisconnection(ws.data.userId); // Tells the master node the user disconnected
	}
	catch (err) {
		console.log(`disconnection of ${ws.data.userId} couldn't be notified to master node\n\t` + err);
		// In case of error the master node will be notified about the disconnection when they try to send a message to this user and this node tells the user is disconnected
	}
}
