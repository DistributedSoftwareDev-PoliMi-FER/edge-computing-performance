import * as crypto from 'crypto-js';
import { KeyLike } from 'jose';
import { getAuth0Token } from './auth0-api';
import { getAuth0Key } from './authentication-service';

export const DB_TEST = 'mongodb://stefanoNormal:DeDq9uJ5R9WoVrYM8c5L@mongodsd.duckdns.org:27017/dbtest_stefano?authSource=dbtest_stefano&ssl=true';
export const ENCRYPTION_PASSWORD = crypto.enc.Utf8.parse('aAbBcCdDeEfFgGhHaAbBcCdDeEfFgGhH');
export const ENCRYPTION_IV = crypto.enc.Utf8.parse('aAbBcCdDeEfFgGhHaAbBcCdDeEfFgGhH');
export const ENCRYPTION_VERIFICATOR = 'originaluser';

//global values for auth0
export const AUTH0_AUDIENCE = 'https://polimi-edge-computing.eu.auth0.com/api/v2/';
export const AUTH0_URL = 'https://polimi-edge-computing.eu.auth0.com';
export const AUTH0_CLIENT_ID = 'tEydfVBObitQV0a048IAMuip1iQXPmTO';
export const AUTH0_CLIENT_SECRET = 'HPSnoxep7F9k-sOmZ6NwhpmLZTk9PzySVT_ag2auyzefzZej8OmXxYJiF1wTyrFM';



export let AUTH0_TOKEN: string;
export let AUTH0_KEY: KeyLike | Uint8Array;

getAuth0Key().then(res => {
	AUTH0_KEY = res;
	console.log('AUTH0_KEY: ' + AUTH0_KEY);
})
	.catch(err => console.log('getAuth0Key error')); 


export function changeAut0Token(res: any){
	AUTH0_TOKEN = res;
	console.log('AUTH0_TOKEN: ' + AUTH0_TOKEN);
	return;
}

setInterval(changeAut0Token, 86400000); // Refreshes the token once every (almost) 24h

//Valuses for testing
export let TESTING = 0;

export function isTesting(){
	console.log('testing mode enabled');
	TESTING = 1;
}

export let STRESS_TESTING = 0;

export function isStressTesting(){
	console.log('stress testing mode enabled');
	STRESS_TESTING = 1;
}