
export class EdgeChatMessage {
    senderId: string;
    receiverId: string;
    message: string;
    date: Date;
    senderUsername: string;

    constructor(senderId: string, receiverId: string, message: string, date: Date, username: string) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.message = message;
        this.date = date;
        this.senderUsername = username;
    }
}
