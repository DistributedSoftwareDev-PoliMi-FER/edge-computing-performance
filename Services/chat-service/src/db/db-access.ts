import * as mongoose from 'mongoose';
import {ChatHistoryStruct, ChatHistory} from '../model/chat-history';

export function connectionDB(dbAddress: string){
	mongoose.connect(dbAddress);
}


const chatHistorySchema = new mongoose.Schema({
	users: {
		type: Array,
		required: true
	},
	history: {
		type: Array,
		required: true
	}
});

const chatHistory: mongoose.Model<ChatHistoryStruct> = mongoose.model('ChatHistory', chatHistorySchema);

//This function searchs in the db all the chat history of an user 
export async function findChatHistory(userId: string){
	try {
		const existsOnUser = await chatHistory.count({ 'users.userId': userId });

		if(existsOnUser === 0){
			//Console.log('Cannot find this chat history of ' + userId);
			return 'NO HISTORY';
		}
		else {
			const resOnUser = await chatHistory.find({ 'users.userId': userId }).lean();
			return resOnUser;
		}
	}
	catch (err){
		throw new Error('unknow database error: ' + err);
	}
}

//This function searchs in the db the chat history between two users
export async function findChatHistoryforTwo(userOneId: string, userTwoId: string){
	try {
		const existsOnUsers = await chatHistory.count({ 'users.userId': { $all: [userOneId, userTwoId] } });

		if(existsOnUsers === 0){
			
			//Console.log('Cannot find this chat history of ' + userOneId + " and " + userTwoId);
			return 'NO HISTORY';
		}
		else {
			const resOnUsers = await chatHistory.find({ 'users.userId': { $all: [userOneId, userTwoId] } }).lean();
			return resOnUsers;
		}
	}
	catch (err){
		throw new Error('unknow database error: ' + err);
	}
}

//This function updates the chat history between two users in the db: adds the new message to the array of messages
export async function updateChatHistory(message: any, senderId: string, receiverId: string){
	try {
		const res = await chatHistory.updateOne(
			{ 'users.userId': { $all: [senderId, receiverId] } },
			{ $push: { history: message}}
		);
	
		if(res.modifiedCount === 0){
			//Console.log('Cannot find this chat history: no history chat updated');
			return false;
		}
		else {
			return true; //I can check that have modified only one element
		}
	}
	catch (err){
		throw new Error('unknow database error: ' + err);
	}
}

//This function create a new chat history between two users in the db
export async function createHistoryChat(newChatHistory: ChatHistory){
	try {
		//Console.log("create");
		await chatHistory.create(newChatHistory);
		return true;
	}
	catch (err){
		throw new Error('unknow database error: ' + err);
	}
}



export function done() {
	throw new Error('Function not implemented.');
}

