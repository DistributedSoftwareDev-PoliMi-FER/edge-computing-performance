import * as crypto from 'crypto-js';
import { Message } from '../model/message';
import { ENCRYPTION_IV, ENCRYPTION_PASSWORD, ENCRYPTION_VERIFICATOR } from './global-value';



export function encryptMessage(message: Message) {
	const sender = encryptString(message.senderId);
	const receiver = encryptString(message.receiverId);
	message.senderId = sender;
	message.receiverId = receiver;
	return message;
}


export function decryptMessage(message: Message) {
	message.receiverId = decryptString(message.receiverId);
	return message;
}


export function encryptString(text: string) {
	return crypto.AES.encrypt(`${text}${ENCRYPTION_VERIFICATOR}`, ENCRYPTION_PASSWORD, { iv: ENCRYPTION_IV }).toString();
}


export function decryptString(text: string) {
	const plain = crypto.AES.decrypt(text, ENCRYPTION_PASSWORD, { iv: ENCRYPTION_IV }).toString(crypto.enc.Utf8);
	//Console.log(plain);
	
	if(!plain.endsWith(ENCRYPTION_VERIFICATOR)) {
		throw new Error('Text is not original'); 
	}
	return plain.substring(0, plain.length - ENCRYPTION_VERIFICATOR.length);
}
