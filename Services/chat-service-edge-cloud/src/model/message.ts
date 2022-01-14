// This class represents the message object that the client uses for the chat
export class Message {
	senderId: string;
	receiverId: string;
	message: string;
	date: Date;

	public constructor(senderId: string, receiverId: string, message: string, date: Date) {
		this.senderId = senderId;
		this.receiverId = receiverId;
		this.message = message;
		this.date = date;
	}
}