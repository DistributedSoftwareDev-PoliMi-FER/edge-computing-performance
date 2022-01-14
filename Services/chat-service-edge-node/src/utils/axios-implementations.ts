import axios from 'axios';
import { Message } from '../model/Message';
import { CHAT_SERVICE_URL, USERS_NODE_SERVICE_URL } from './global-parameters';
import { MockedChatService, MockedUserNodeService } from './mocked-services';

// Collection of methods used to send http requests and wait for a response
export interface AxiosActions {
    post(address: string, okCode: number, message?: any): any;
    get(address: string, okCode: number, message?: any): any;
    delete(address: string, okCode: number, message?: any): any;
}


// Production ready implementation of the AxiosActions
export class AxiosRealActions implements AxiosActions {

	// Performs a post request and waits for a response with the specified status code
	public async post(address: string, okCode: number, message?: any) {
		const res = await axios.post(address, message);
		if(res.status !== okCode) {
			throw new Error(`Bad code received: ${res.status} instead of ${okCode}: ${res.data}`);
		}
		return res.data;
	}

	// Performs a get request and waits for a response with the specified status code
	public async get(address: string, okCode: number, message?: any) {
		const res = await axios.get(address, message);
		if(res.status !== okCode) {
			throw new Error(`Bad code received: ${res.status} instead of ${okCode}: ${res.data}`);
		}
		return res.data;
	}

	// Performs a delete request and waits for a response with the specified status code
	public async delete(address: string, okCode: number, message?: any) {
		const res = await axios.delete(address, {data: message});
		if(res.status !== okCode) {
			throw new Error(`Bad code received: ${res.status} instead of ${okCode}: ${res.data}`);
		}
		return res.data;
	}

}




// Mocked implementation of the AxiosActions. In this implementation the users-node-service and the chat-service are mocked, whereas the edge-node-chat-service is real
export class AxiosMockActions implements AxiosActions {
	
	private ip: string;
	private userNodeService: MockedUserNodeService; // Mocked users-node-service structure
	private chatService: MockedChatService; // Mocked chat-service structure

	public constructor(ip: string, userNodeService: MockedUserNodeService, chatService: MockedChatService) {
		this.ip = ip;
		this.userNodeService = userNodeService;
		this.chatService = chatService;
	}

	// Performs a mocked post request
	public async post(address: string, okCode: number, message?: any) {
		// If the request was headed towards the users node service, then add/update the new user-node pair
		if(address.includes(USERS_NODE_SERVICE_URL)) {
			this.userNodeService.post(message.idUser, this.ip);
		}
        
		// If the request was headed towards the chat service, then add the new message to the history
		else if(address.includes(CHAT_SERVICE_URL)) {
			this.chatService.post(message);
		}

		else {
			const res = await axios.post(address, message);
			if(res.status !== okCode) {
				throw new Error(`Bad code received: ${res.status} instead of ${okCode}`);
			}
			return res.data;
		}
		// Returns void because at the moment we never use the response body during post requests
	}

	// Performs a mocked get request
	public async get(address: string, okCode: number, message?: any) {
		// If the request was headed towards the users node service, then return the user-node pair if it exists, if not throw an error
		if(address.includes(USERS_NODE_SERVICE_URL)) {
			return this.userNodeService.get(message.idUser);
		}

		// If the request was headed towards the chat service history, then return the history as a json
		else if(address.includes(CHAT_SERVICE_URL + 'chatHistory')) {
			const user1 = address.substring(address.indexOf('?userOneId=') + '?userOneId='.length, address.indexOf('&userTwoId'));
			const user2 = address.substring(address.indexOf('userTwoId=') + 'userTwoId='.length);
			return this.chatService.getHistory(user1, user2);
		}

		// If the request was headed towards the chat service chat overview, then return the overview as a json
		else if(address.includes(CHAT_SERVICE_URL + 'chatOverview')) {
			return this.chatService.getOverview(address.substring(address.indexOf('?userId=') + '?userId='.length));
		}

		else {
			const res = await axios.get(address, message);
			if(res.status !== okCode) {
				throw new Error(`Bad code received: ${res.status} instead of ${okCode}`);
			}
			return res.data;
		}
	}

	// Performs a mocked delete request
	public async delete(address: string, okCode: number, message?: any) {
		// If the request was headed towards the users node service, then remove the user-node pair
		// TODO in that service there should be a route where you have to specify both the user and the node in order to remove them. This is to deal with outdated data in edge nodes
		if(address === USERS_NODE_SERVICE_URL) {
			this.userNodeService.delete(message.idUser);
		}

		else if(address === USERS_NODE_SERVICE_URL + 'TODO') {
			this.userNodeService.deleteSecure(message.idUser, this.ip);
		}

		else {
			const res = await axios.delete(address, message);
			if(res.status !== okCode) {
				throw new Error(`Bad code received: ${res.status} instead of ${okCode}`);
			}
			return res.data;
		}
	}
    
}
