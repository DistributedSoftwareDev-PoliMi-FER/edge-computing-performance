import axios from 'axios';
import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_TOKEN, AUTH0_URL } from './global-parameters';

export interface Auth0Tools {
	getAuth0Token(): Promise<any>
	usernameToId(username: string): Promise<any>;
	idToUsername(userId: string): Promise<any>;
}


export class Auth0ToolsReal implements Auth0Tools {
	async getAuth0Token() {
		/* eslint-disable camelcase */
		const res = await axios.post(`${AUTH0_URL}/oauth/token`, {
			client_id: AUTH0_CLIENT_ID,
			client_secret: AUTH0_CLIENT_SECRET,
			audience: AUTH0_AUDIENCE,
			grant_type: 'client_credentials',
		});
		/* eslint-enable camelcase */

		return res.data.access_token;
	}

	async usernameToId(username: string) {
		console.log(`usernameToId: ${AUTH0_URL}/api/v2/users?q=username%3A%22${username}%22&search_engine=v3`);  
		const res = await axios.get(`${AUTH0_URL}/api/v2/users?q=username%3A%22${username}%22&search_engine=v3`, { headers: { authorization: `Bearer ${AUTH0_TOKEN}` } });
		return res.data[0].user_id;
	}

	async idToUsername(userId: string) {
		console.log(`idToUsername: ${AUTH0_URL}/api/v2/users?q=user_id%3A%22${userId}%22&search_engine=v3`);  
		const res = await axios.get(`${AUTH0_URL}/api/v2/users?q=user_id%3A%22${userId}%22&search_engine=v3`, { headers: { authorization: `Bearer ${AUTH0_TOKEN}` } });
		return res.data[0].username;
	}
}


export class Auth0ToolsMocked implements Auth0Tools {
	async getAuth0Token() {
		return 'TESTING';
	}
	
	async usernameToId(username: string) {
		return username;
	}

	async idToUsername(userId: string) {
		return userId;
	}
}
