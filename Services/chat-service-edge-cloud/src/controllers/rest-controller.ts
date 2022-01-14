import { NextFunction, Request, Response } from 'express';
import * as chatHistoryService from '../services/chat-history-service';
import {encryptString, } from '../utils/crypto';
import { ErrorCode, RestError } from '../utils/errors';
import { userIdToUsername } from '../utils/auth0-api';

// This function responds to an http get request sending the chats' history between two users
export async function getChatHistory(req: Request, res: Response, next: NextFunction){ 
	//Console.log('start funcion');
	try {
		if(req.query.userOneId === undefined || req.query.userTwoId === undefined){
			throw new RestError('userOneId or/and userTwoId is/are missing', ErrorCode.GET_REQUEST_ERROR, 404);
		}

		console.log('getHistory request form node. Request of ' + req.query.userOneId + ' and ' + req.query.userTwoId + ' chat history');

		const userOneId = req.query.userOneId as string;
		const userTwoId = req.query.userTwoId as string;

		//Console.log('search in db');
		// The users id are encrypted so I have to decrypt them
		const chatHistory = await chatHistoryService.getHistoryChat(userOneId, userTwoId);

		//Console.log(chatHistory);
		if(chatHistory === 'NO HISTORY'){
			throw new RestError('Cannot find this chat history of ' + userOneId + ' and ' + userTwoId, ErrorCode.CHAT_HISTORY_NOT_FOUND, 404);
		}
		else {
			//Console.log('convert');
			const chatHistoryToSend = await addUserIdEnc(chatHistory);

			//Console.log('send status');
			res.status(200).json(chatHistoryToSend);
		}
	}
	catch (err){
		res.status((err as RestError).statusCode).json(err);
	}
}


export async function getChatOverview(req: Request, res: Response, next: NextFunction) {
	try {
		if(req.query.userId === undefined){
			throw new RestError('userId is missing', ErrorCode.GET_REQUEST_ERROR, 404);
		}

		console.log('getOverview request form: ' + req.query.userId);
		const userId = req.query.userId as string;
		//Console.log(req.body.userId);
		const chatHistory = await chatHistoryService.getHistoryChatOfOneUser(userId);

		if(chatHistory === 'NO HISTORY'){
			throw new RestError('Cannot find this chat overview of ' + userId, ErrorCode.CHAT_HISTORY_NOT_FOUND, 404);
		}
		else {
			const chatOverview = await createChatOverViewFromChatHistory(chatHistory, userId);

			res.status(200).json(chatOverview);
		}
	}
	catch (err){
		res.status((err as RestError).statusCode).json(err);
		return;
	}
}


// This function is used to store messages form a http post request that contains a message
export async function post(req: Request, res: Response, next: NextFunction){
	try {
		console.log('post request form node. Save message');
		//Console.log(res.locals.messageObject);
		res.locals.messageObject.date = new Date(res.locals.messageObject.date);
		const updateHistoryResult = await chatHistoryService.chatHistoryUpdate(res.locals.messageObject);
		if(updateHistoryResult){
		//Console.log("send status")
			res.sendStatus(200);
		}
	}
	catch (err){
		res.status((err as RestError).statusCode).json(err);
	}
}

/**
 * @swagger
 * definitions:
 *   ChatOverview:
 *     type: array
 *     items:
 *       type: object
 *       properties:
 *         username:
 *            type: string
 *         userId:
 *            type: string
 *         lastMessage:
 *            type: string
 *         date:
 *           type: string
 *           format: date-time
 */

//This function create a chat overview from a chat history
async function createChatOverViewFromChatHistory(history: any, userId: string){
	try {
		//Console.log(userId);
		//console.log(history.length);
		const chatOverview = [];
			
		for(let i = 0; i < history.length; i++){
			let usernameTmp = '';
			let userIdTmp = '';
			if(history[i].users[0].userId === userId){
				usernameTmp = await userIdToUsername(history[i].users[1].userId);
				userIdTmp = encryptString(history[i].users[1].userId); 
			}
			else if(history[i].users[1].userId === userId){
				usernameTmp = await userIdToUsername(history[i].users[0].userId);
				userIdTmp = encryptString(history[i].users[0].userId);
			}
			
			const lastMessage = history[i].history[history[i].history.length - 1];
			
			const obj = {username: usernameTmp, userId: userIdTmp, lastMessage: lastMessage.message, date: lastMessage.timeAndData};
			
			chatOverview.push(obj);
		}
		
		return chatOverview;
	}
	catch (err){
		console.log(err);
	}
	
}

// This function trasforms the chat history to the object to sent to the client
async function addUserIdEnc(history: any) {
	try {
		delete history[0]._id;
		delete history[0].__v;

		//Console.log('change');
		//console.log(history[0].users[0].userId);

		history[0].users[0].username = await userIdToUsername(history[0].users[0].userId);
		history[0].users[0].userId = encryptString(history[0].users[0].userId);

		history[0].users[1].username = await userIdToUsername(history[0].users[1].userId);
		history[0].users[1].userId = encryptString(history[0].users[1].userId);

		//Console.log('return');
		return history;
	}
	catch (err){
		console.log(err);
	}
}



