import * as socketIo from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { Message } from '../model/Message';
import { AxiosActions } from '../utils/axios-implementations';
import { encryptMessage } from '../utils/crypto';
import { ErrorCode, RestError } from '../utils/errors';
import { USERS_NODE_SERVICE_URL } from '../utils/global-parameters';
import { UsersCache } from './users-cache';

type WebSocket = socketIo.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

// Manages the users connected to this edge node
export class SocketManager {
	private socketsList: Map<string, WebSocket> = new Map<string, WebSocket>();
	private usersCache: UsersCache;
	private axios: AxiosActions;

	// UsersCache: object who manages users not connected to this edge node
	// axiosImplementation: object used to send http requests to other services. Can be mocked
	public constructor(usersCache: UsersCache, axiosImplementation: AxiosActions) {
		this.usersCache = usersCache;
		this.axios = axiosImplementation;
	}

	// Adds or updates a user and his related websocket
	public add(userId: string, ws: WebSocket) {
		this.socketsList.set(userId, ws);
	}

	// Removes a user
	public remove(userId: string) {
		this.socketsList.delete(userId);
	}

	// Tries to send a message to the specified user locally. If he cannot do it tries to send it to the receiver user using the usersCache object (not locally).
	public async sendTo(message: Message) {
		if(this.socketsList.has(message.receiverId)) {
			(this.socketsList.get(message.receiverId) as WebSocket).emit('chat_message', encryptMessage(message));
			console.log('message delivered to final user! (websocket): ' + message.message);			
		}
		else {
			console.log('sending message through cache: ' + message.message);	
			await this.usersCache.sendTo(message);
		}
	}


	// Tries to deliver the message to a local user, if it doesn't have that user it notifies the master node and the sender node that they have outdated info
	public async sendToLocal(message: Message) {
		console.log('sending message to final user (REST)' + message.message);
		if(this.socketsList.has(message.receiverId)) {
			(this.socketsList.get(message.receiverId) as WebSocket).emit('chat_message', encryptMessage(message));
			console.log('message delivered to final user! (REST): ' + message.message);
			return;
		}
		
		try {
			console.log("I don't own the receiver of the message. Notifying this to master node: " + message.receiverId);
			await this.axios.delete(USERS_NODE_SERVICE_URL + 'ByAll/', 200, { idUser: message.receiverId }); // Tell the master node that he has outdated info about the user
		}
		catch (err) {
			console.error("couldn't communicate with master node\n\t" + err);
			// In case of error the master node will be notified about the disconnection when they try to send a message to this user and this node tells the user is disconnected
		}
		throw new RestError("This node doesn't own the receiver user", ErrorCode.RECEIVER_USER_NOT_FOUND_ERROR, 422); // Basically tell the sending node that the delivery failed
	}
}
