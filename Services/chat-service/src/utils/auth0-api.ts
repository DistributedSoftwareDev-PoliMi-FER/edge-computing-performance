// Import NPM Modules
import axios from 'axios';
import {AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_TOKEN, AUTH0_URL, changeAut0Token}  from './global-value';


export async function getAuth0Token() {
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

//If the username doesn't exist the function returns res.data[0] === undefined
export async function usernameToId(username: string) {    
	const res = await axios.get(`${AUTH0_URL}/api/v2/users?q=username%3A%22${username}%22&search_engine=v3`, { headers: { authorization: `Bearer ${AUTH0_TOKEN}` } });
	if(res.data[0] === undefined){
		throw new Error('username not found');
	}
	return res.data[0].user_id;
}

export async function userIdToUsername(userId: string) {    
	const res = await axios.get(`${AUTH0_URL}/api/v2/users?q=user_id%3A%22${userId}%22&search_engine=v3`, { headers: { authorization: `Bearer ${AUTH0_TOKEN}` } });
	if(res.data[0] === undefined){
		throw new Error('userId not found');
	}
	return res.data[0].username;
}
