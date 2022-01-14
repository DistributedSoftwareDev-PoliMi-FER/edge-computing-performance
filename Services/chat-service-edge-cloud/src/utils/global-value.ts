import * as crypto from 'crypto-js';
import { KeyLike } from 'jose';
import { getAuth0Token } from './auth0-api';
import { getAuth0Key } from './authentication-service';

getAuth0Key().then(res => {
	AUTH0_KEY = res;
	console.log('AUTH0_KEY: ' + AUTH0_KEY);
}).catch(err => console.log('getAuth0Key error' + err)); 

//global values for crypto
export const ENCRYPTION_PASSWORD = crypto.enc.Utf8.parse('aAbBcCdDeEfFgGhHaAbBcCdDeEfFgGhH');
export const ENCRYPTION_IV = crypto.enc.Utf8.parse('aAbBcCdDeEfFgGhHaAbBcCdDeEfFgGhH');
export const ENCRYPTION_VERIFICATOR = 'originaluser';


//global values for auth0
export const AUTH0_URL = 'https://polimi-edge-computing.eu.auth0.com';
export const AUTH0_CLIENT_ID = 'tEydfVBObitQV0a048IAMuip1iQXPmTO';
export const AUTH0_CLIENT_SECRET = 'HPSnoxep7F9k-sOmZ6NwhpmLZTk9PzySVT_ag2auyzefzZej8OmXxYJiF1wTyrFM';
export const AUTH0_AUDIENCE = 'https://polimi-edge-computing.eu.auth0.com/api/v2/';
export let AUTH0_TOKEN: string;
export let AUTH0_KEY: KeyLike | Uint8Array;

getAuth0Token().then(res => {
	AUTH0_TOKEN = res;
	console.log('AUTH0_TOKEN: ' + AUTH0_TOKEN);
}).catch(err => console.log(err));

setInterval(getAuth0Token, 86400000); // Refreshes the token once every (almost) 24h