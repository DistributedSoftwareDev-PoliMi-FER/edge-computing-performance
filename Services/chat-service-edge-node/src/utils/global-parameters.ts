import { Auth0Authentication, Auth0AuthenticationMocked, Auth0AuthenticationReal } from './auth0-communication';
import * as crypto from 'crypto-js';
import { KeyLike } from 'jose';
import { Auth0Tools, Auth0ToolsMocked, Auth0ToolsReal } from './auth0-api';

export const NODE_ENV = process.env.NODE_ENV as string;
const version = '1.2.1';

export let PORT_NUMBER: string;
export let SEND_TO_PORT: string;
export let IS_SERVICE_READY: boolean;
export let USERS_NODE_SERVICE_URL: string;
export let CHAT_SERVICE_URL: string;
export let ENCRYPTION_PASSWORD: crypto.lib.WordArray;
export let ENCRYPTION_IV: crypto.lib.WordArray;
export let ENCRYPTION_VERIFICATOR: string;
export let AUTH0_KEY: KeyLike | Uint8Array;
export let AUTH0_URL: string;
export let AUTH0_CLIENT_ID: string;
export let AUTH0_CLIENT_SECRET: string;
export let AUTH0_AUDIENCE: string;
export let AUTH0_TOKEN: string; 
export let AUTH_SERVICE: Auth0Authentication;
export let AUTH_TOOLS: Auth0Tools;
export let M2M_AUTH_PW: string;
export let BACKUP_FIRST: boolean;
export let UNSENT_MESSAGES_INTERVAL: number;



if(NODE_ENV === 'production') {
	console.warn('PRODUCTION ENVIRONMENT ' + version + '\n');
	
	AUTH_SERVICE = new Auth0AuthenticationReal();
	auth0KeyGetter();	
	AUTH_TOOLS = new Auth0ToolsReal();
	PORT_NUMBER = process.env.HTTP_PORT as string;
	SEND_TO_PORT = process.env.SEND_TO_PORT as string;
	IS_SERVICE_READY = true;
	USERS_NODE_SERVICE_URL = process.env.API_URL + '/api/user-node-service/';
	CHAT_SERVICE_URL = process.env.API_URL + '/api/chat-service-edge-cloud/';
	ENCRYPTION_PASSWORD = crypto.enc.Utf8.parse(process.env.ENCRYPTION_PASSWORD as string);
	ENCRYPTION_IV = crypto.enc.Utf8.parse(process.env.ENCRYPTION_PASSWORD as string);
	ENCRYPTION_VERIFICATOR = process.env.ENCRYPTION_VERIFICATOR as string;
	AUTH0_URL = process.env.AUTH0_URL as string;
	AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID as string;
	AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET as string;
	AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE as string;
	M2M_AUTH_PW = process.env.M2M_AUTH_PW as string;
	BACKUP_FIRST = process.env.BACKUP_FIRST as string === 'true' ? true : false;
	UNSENT_MESSAGES_INTERVAL = Number(process.env.UNSENT_MESSAGES_INTERVAL as string);
}

else if(NODE_ENV === 'testing') {
	console.warn('TESTING ENVIRONMENT ' + version);
	
	AUTH_SERVICE = new Auth0AuthenticationMocked();
	auth0KeyGetter();
	AUTH_TOOLS = new Auth0ToolsMocked();
	PORT_NUMBER = process.env.HTTP_PORT as string;
	SEND_TO_PORT = process.env.SEND_TO_PORT as string;
	IS_SERVICE_READY = true;
	USERS_NODE_SERVICE_URL = process.env.API_URL + '/api/user-node-service/';
	CHAT_SERVICE_URL = process.env.API_URL + '/api/chat-service-edge-cloud/';
	ENCRYPTION_PASSWORD = crypto.enc.Utf8.parse(process.env.ENCRYPTION_PASSWORD as string);
	ENCRYPTION_IV = crypto.enc.Utf8.parse(process.env.ENCRYPTION_PASSWORD as string);
	ENCRYPTION_VERIFICATOR = process.env.ENCRYPTION_VERIFICATOR as string;
	AUTH0_URL = process.env.AUTH0_URL as string;
	AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID as string;
	AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET as string;
	AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE as string;
	M2M_AUTH_PW = process.env.M2M_AUTH_PW as string;
	BACKUP_FIRST = process.env.BACKUP_FIRST as string === 'true' ? true : false;
	UNSENT_MESSAGES_INTERVAL = Number(process.env.UNSENT_MESSAGES_INTERVAL as string);
}

else {
	console.warn('LOCAL TESTING ENVIRONMENT ' + version);

	AUTH_SERVICE = new Auth0AuthenticationMocked();
	auth0KeyGetter();
	AUTH_TOOLS = new Auth0ToolsMocked();
	PORT_NUMBER = '14009';
	SEND_TO_PORT = '14009';
	IS_SERVICE_READY = true;
	USERS_NODE_SERVICE_URL = 'https://edge-computing.polimi-ecb7249.gcp.mia-platform.eu/api/user-node-service/';
	CHAT_SERVICE_URL = 'https://edge-computing.polimi-ecb7249.gcp.mia-platform.eu/api/chat-service/';
	ENCRYPTION_PASSWORD = crypto.enc.Utf8.parse('aAbBcCdDeEfFgGhHaAbBcCdDeEfFgGhH');
	ENCRYPTION_IV = crypto.enc.Utf8.parse('aAbBcCdDeEfFgGhHaAbBcCdDeEfFgGhH');
	ENCRYPTION_VERIFICATOR = 'originaluser';
	AUTH0_URL = 'https://polimi-edge-computing.eu.auth0.com';
	AUTH0_CLIENT_ID = 'tEydfVBObitQV0a048IAMuip1iQXPmTO';
	AUTH0_CLIENT_SECRET = 'HPSnoxep7F9k-sOmZ6NwhpmLZTk9PzySVT_ag2auyzefzZej8OmXxYJiF1wTyrFM';
	AUTH0_AUDIENCE = 'https://polimi-edge-computing.eu.auth0.com/api/v2/';
	M2M_AUTH_PW = 'm2m_Password';
	BACKUP_FIRST = false;
	UNSENT_MESSAGES_INTERVAL = 0;
}


console.warn('PORT_NUMBER:\t' + PORT_NUMBER);
console.warn('SEND_TO_PORT:\t' + SEND_TO_PORT);
console.warn('IS_SERVICE_READY:\t' + IS_SERVICE_READY);
console.warn('BACKUP_FIRST:\t', BACKUP_FIRST);
console.warn('UNSENT_MESSAGES_INTERVAL:\t', UNSENT_MESSAGES_INTERVAL);
console.warn('USERS_NODE_SERVICE_URL:\t' + USERS_NODE_SERVICE_URL);
console.warn('CHAT_SERVICE_URL:\t' + CHAT_SERVICE_URL);
console.warn('ENCRYPTION_PASSWORD:\t' + ENCRYPTION_PASSWORD);
console.warn('ENCRYPTION_IV:\t' + ENCRYPTION_IV);
console.warn('ENCRYPTION_VERIFICATOR:\t' + ENCRYPTION_VERIFICATOR);
console.warn('AUTH0_URL:\t' + AUTH0_URL);
console.warn('AUTH0_CLIENT_ID:\t' + AUTH0_CLIENT_ID);
console.warn('AUTH0_CLIENT_SECRET:\t' + AUTH0_CLIENT_SECRET);
console.warn('AUTH0_AUDIENCE:\t' + AUTH0_AUDIENCE);
console.warn('AUTH_SERVICE:\t' + AUTH_SERVICE);
console.warn('AUTH_TOOLS:\t' + AUTH_TOOLS);
console.warn('M2M_AUTH_PW:\t' + M2M_AUTH_PW);


function auth0TokenGetter() {
	AUTH_TOOLS.getAuth0Token().then(res => {
		AUTH0_TOKEN = res;
		console.warn('AUTH0_TOKEN: ' + AUTH0_TOKEN.substring(0, 15) + '...\n\n\n');
	}).catch(err => console.error('getAuth0Token error\n\t' + err + '\n\n\n'));
}

function auth0KeyGetter() {
	AUTH_SERVICE.getAuth0Key().then(res => {
		AUTH0_KEY = res;
		console.warn('AUTH0_KEY: ' + AUTH0_KEY);
	}).catch(err => console.error('getAuth0Key error\n\t' + err));
}

auth0TokenGetter();
setInterval(auth0TokenGetter, 86400000); // Refreshes the token once every (almost) 24h
