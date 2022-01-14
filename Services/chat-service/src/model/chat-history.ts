import {MessageToSave} from './message-to-save';


export interface ChatHistoryStruct{
    users: User[];
    history: MessageToSave[]; 
}

// This class represents the object used to save the chat history
export class ChatHistory implements ChatHistoryStruct{
	users!: User[];
	history!: MessageToSave[];

	public static createHistoryChat(message: string, userOneId: string, userTwoId: string, data: Date){
		const chatHistory = new ChatHistory();

		chatHistory.users = [];
		chatHistory.users.push(User.createUser(userOneId, 0));
		chatHistory.users.push(User.createUser(userTwoId, 1));

		const messageToSave: MessageToSave = MessageToSave.createMessage(0, message, data);
		chatHistory.history = [];
		chatHistory.history.push(messageToSave);

		return chatHistory;
	}
}


export class User{
	userId!: string;
	id!: number;

	public static createUser(userId: string, pos: number){
		const user = new User();

		user.userId = userId;
		user.id = pos;

		return user;
	}
}