import * as crypto from 'crypto-js';
import { Message } from '../model/Message';
import { ENCRYPTION_IV, ENCRYPTION_PASSWORD, ENCRYPTION_VERIFICATOR } from './global-parameters';



export function encryptMessage(message: Message) {
	const res = new Message('', '', '', '', '');
	const sender = encryptString(message.senderId);
	const receiver = encryptString(message.receiverId);
	res.senderId = sender;
	res.receiverId = receiver;
	res.date = message.date;
	res.message = message.message;
	res.senderUsername = message.senderUsername;
	return res;
}


export function decryptMessage(message: Message) {
	const res = new Message('', '', '', '', '');
	res.receiverId = decryptString(message.receiverId);
	res.senderId = message.senderId;
	res.date = message.date;
	res.message = message.message;
	res.senderUsername = message.senderUsername;
	return res;
}


export function encryptString(text: string) {
	return crypto.AES.encrypt(`${text}${ENCRYPTION_VERIFICATOR}`, ENCRYPTION_PASSWORD, { iv: ENCRYPTION_IV }).toString();
}


export function decryptString(text: string) {
	const plain = crypto.AES.decrypt(text, ENCRYPTION_PASSWORD, { iv: ENCRYPTION_IV }).toString(crypto.enc.Utf8);
	
	if(!plain.endsWith(ENCRYPTION_VERIFICATOR)) {
		throw new Error('Text is not original'); 
	}
	return plain.substring(0, plain.length - ENCRYPTION_VERIFICATOR.length);
}


export function hashString(text: string) {
	return crypto.MD5(text).toString();
}
