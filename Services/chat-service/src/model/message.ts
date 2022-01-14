// This class represents the message object that the client uses for the chat
export class Message {
	senderId: string;
	receiverId: string;
	message: string;

	public constructor(senderId: string, receiverId: string, message: string) {
		this.senderId = senderId;
		this.receiverId = receiverId;
		this.message = message;
	}

	// Checks whether the message Json format is ok
	public static validate(message: any) {
		if(message.receiverId != null && message.message != null) {
			return new Message(message.senderId, message.receiverId, message.message);
		}
		else {
			throw Error('Message format not valid');
		}
	}
}