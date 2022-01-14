export class Message {
	senderId: string;
	receiverId: string;
	senderUsername: string;
	message: string;
	date: string;

	public constructor(senderId: string, receiverId: string, message: string, date: string, senderUsername: string) {
		this.senderId = senderId;
		this.receiverId = receiverId;
		this.senderUsername = senderUsername;
		this.message = message;
		this.date = date;
	}

	// Checks whether the message Json format is ok for webasocket endpoint
	public static validateWs(message: any) {
		if(message.receiverId != null && message.message != null) {
			return new Message('', message.receiverId, message.message, (new Date(Date.now())).toString(), '');
		}
		else {
			throw Error('Message format not valid');
		}
	}

	// Checks whether the message Json format is ok for REST endpoint
	public static validateRest(message: any) {
		if(message.receiverId != null && message.message != null && message.senderUsername != null && message.senderId != null && message.date != null) {
			return new Message(message.senderId, message.receiverId, message.message, message.date, message.senderUsername);
		}
		else {
			throw Error('Message format not valid');
		}
	}
}