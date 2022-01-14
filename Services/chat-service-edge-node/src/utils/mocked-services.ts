import { Message } from '../model/Message';

export class MockedChatService {
	private history: Map<string, Array<Message>> = new Map<string, Array<Message>>();
	public isDown = false;

	public post(message: Message) {
		this.checkDown();
		const chatId = [message.senderId, message.receiverId].sort().toString();
        
		const messages = this.history.get(chatId) ?? new Array<Message>();
		messages.push(message);
		this.history.set(chatId, messages);
	}

	public getHistory(user1: string, user2: string) {
		this.checkDown();
		const chatId = [user1, user2].sort().toString();

		return this.history.get(chatId) ?? '{}';
	}

	public getOverview(user: string) {
		this.checkDown();
		return '{}';
	}

	private checkDown() {
		if(this.isDown) {
			throw new Error('Mocked chat service is down');
		}
	}
}


export class MockedUserNodeService {
	private userNode: Map<string, string> = new Map<string, string>();
	public isDown = false;

	public post(user: string, node: string) {
		this.checkDown();
		this.userNode.set(user, node);
	}

	public delete(user: string) {
		this.checkDown();
		this.userNode.delete(user);
	}

	public deleteSecure(user: string, node: string) {
		this.checkDown();
		if(this.userNode.get(user) === node) {
			this.userNode.delete(user);
		}
	}

	public get(user: string) {
		this.checkDown();
		if(!this.userNode.has(user)) {
			throw Error('User is not connected');
		}

		return {userId: user, nodeIp: this.userNode.get(user)};
	}

	private checkDown() {
		if(this.isDown) {
			throw new Error('Mocked user node service is down');
		}
	}
}