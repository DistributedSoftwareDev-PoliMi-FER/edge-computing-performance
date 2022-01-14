import * as db from '../db/db-access';
import {MessageToSave} from '../model/message-to-save';
import {ChatHistory} from '../model/chat-history';
import { Message } from '../model/message';


//This function returns the chat history between two users
export async function getHistoryChat(userOneId: string, userTwoId: string){
	return await db.findChatHistoryforTwo(userOneId, userTwoId);
}

export async function getHistoryChatOfOneUser(userId: string){
	return await db.findChatHistory(userId);
}

//This function updates or creates the chat history between two users in the db
export async function chatHistoryUpdate(message: Message){
	const historyChat = await db.findChatHistoryforTwo(message.senderId, message.receiverId);
	
	if(historyChat === 'NO HISTORY'){
		//Console.log('no history');
		const newChatHistory = ChatHistory.createHistoryChat(message.message, message.senderId, message.receiverId, message.date);
		const createChatHistory = await db.createHistoryChat(newChatHistory);
		return true;
	}
	else {
		//Console.log('si history');
		let messageToSave: MessageToSave;

		if(historyChat[0].users[0].userId === message.senderId){
			messageToSave = MessageToSave.createMessage(0, message.message, message.date);
		}
		else {
			messageToSave = MessageToSave.createMessage(1, message.message, message.date);
		}

		const notNewHistory = await db.updateChatHistory(messageToSave, message.senderId, message.receiverId);
		return true;
	}
}
