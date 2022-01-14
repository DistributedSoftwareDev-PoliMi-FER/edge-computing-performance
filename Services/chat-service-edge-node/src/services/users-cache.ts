import { Message } from '../model/Message';
import { AxiosActions } from '../utils/axios-implementations';
import { hashString } from '../utils/crypto';
import { M2M_AUTH_PW, SEND_TO_PORT, USERS_NODE_SERVICE_URL } from '../utils/global-parameters';

// Manages the delivery of messages to users who are not connected to this edge node
export class UsersCache {
	private cache: Map<string, string>;
	private axios: AxiosActions;

	// AxiosImplementation: object used to send http requests to other services. Can be mocked
	public constructor(axiosImplementation: AxiosActions) {
		this.axios = axiosImplementation;
		this.cache = new Map<string, string>();
	}

	// Looks for a pair containing the receiver ID in the local cache. 
	// If the pair is found, the message is sent to the relative edge node, if not ask the master node where to send it and save the new record in the cache.
	public async sendTo(message: Message, isRetry = false) {
		// Case: we know where to send the message
		if(this.cache.has(message.receiverId)) {
			const receiverNodeIp = this.cache.get(message.receiverId) as string; 
			try {
				console.log('sending message via cache: ' + 'http://' + receiverNodeIp + ':' + SEND_TO_PORT + '/api/chat-service-edge-node/ \t message: ' + message.message);
				await this.axios.post('http://' + receiverNodeIp + ':' + SEND_TO_PORT + '/api/chat-service-edge-node/', 200, { message: message, pw: hashString(M2M_AUTH_PW) });
				console.log('message delivered to final edge node!: ' + message.message);
			} 
			catch (error) {
				// If you get an error, then it means the user doesn't exists on the remote edge node, so your cache info is outdated!
				// Then remove the user from the cache and retry to send the message to him (this time the else branch will be taken)
				// If this attempt is already a retry and it failed, nothing can be done because it means the server has some problems. However the message has already been sent to the server for backup purposes, so the receiver will get it when he reconnects
				console.warn('cache is probably outdated. Will it be retried?: ' + !isRetry + '\n\t' + error);
				this.cache.delete(message.receiverId);
				if(!isRetry) {
					this.sendTo(message);
				}
			}
		}

		//Case: we don't know where to send the message
		else {
			let res: any;
			try {
				console.log('asking master node for final node info: ' + USERS_NODE_SERVICE_URL + message.receiverId);
				res = await this.axios.get(USERS_NODE_SERVICE_URL + message.receiverId, 200);
				console.log('master node answered: ' + res[0].ipEdgenode);
			}
			catch (err) {
				console.error("master node didn't respond with info about: " + message.receiverId + '\n\t' + err);
				return;
			}
			try {
				// If you get the user from the master node, add it to your cache and retry to send the message
				this.cache.set(message.receiverId, res[0].ipEdgenode);
				console.log("cache updated! I'll retry to send the message: " + message.message + '\t receiverId' + message.receiverId);
				
				// Retry to send the message
				this.sendTo(message, true); 
			} 
			catch (error) {
				// If you get an error then the user is not connected and nothing can be done. The message has already been sent to the server for backup purposes, so the receiver will get it when he reconnects
				console.error('cannot send the message: ' + message.message + ' , it will be retried later\n\t' + error);
			}
		}
	}

}
