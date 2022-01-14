import { AxiosActions } from '../utils/axios-implementations';
import { CHAT_SERVICE_URL, USERS_NODE_SERVICE_URL } from '../utils/global-parameters';

let axios: AxiosActions;
// Sets the object used to send http requests to other services. It can be implemented as a mocked service for testing purposes
export function setAxiosImplementation(axiosImplementation: AxiosActions) {
	axios = axiosImplementation;
}

// Tells the master node that a new user connected to this edge node
export async function notifyNewConnection(userId: string) {
	console.log('notifying new connection of user: ' + userId + ' to master node: ' + USERS_NODE_SERVICE_URL);
	await axios.post(USERS_NODE_SERVICE_URL, 201, {idUser: userId});
}

// Tells the master node that the user disconnected from this node
export async function notifyDisconnection(userId: string) {
	console.log('notifying disconnection of user ' + userId + ' to master node: ' + USERS_NODE_SERVICE_URL + 'byAll/');
	await axios.delete(USERS_NODE_SERVICE_URL + 'byAll/', 200, {idUser: userId});
}

// Returns the chat history for the specified users pair
export async function retrieveChatHistory(userOneId: string, userTwoId: string) {
	console.log('retrieving chat history: ' + CHAT_SERVICE_URL + 'chatHistory/?userOneId=' + userOneId + '&userTwoId=' + userTwoId);	
	return await axios.get(CHAT_SERVICE_URL + 'chatHistory/?userOneId=' + userOneId + '&userTwoId=' + userTwoId, 200);
}

// Returns the chat overview for the specified user
export async function retrieveChatOverview(userId: string) {
	console.log('retrieving chat overview: ' + CHAT_SERVICE_URL + 'chatOverview/?userId=' + userId);
	return await axios.get(CHAT_SERVICE_URL + 'chatOverview/?userId=' + userId, 200);
}
