import * as crypto from 'crypto-js';

//global values for crypto
export const ENCRYPTION_PASSWORD = crypto.enc.Utf8.parse('aAbBcCdDeEfFgGhHaAbBcCdDeEfFgGhH');
export const ENCRYPTION_IV = crypto.enc.Utf8.parse('aAbBcCdDeEfFgGhHaAbBcCdDeEfFgGhH');
export const ENCRYPTION_VERIFICATOR = 'originaluser';