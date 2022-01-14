import {Injectable} from "@angular/core";

import {ChatAdapter, Message, ParticipantResponse, User} from "ng-chat";
import {Observable, of} from "rxjs";

import {ChatService} from "./services/chat.service";
import {EdgeChatMessage} from "./model/EdgeChatMessage";
import {ChatHistoryMessage, EdgeChatHistory} from "./model/EdgeChatHistory";
import {EdgeUser} from "./model/EdgeUser";

// custom adapter for the ng-chat library
@Injectable({
    providedIn: 'root'
})
export class EdgeChatAdapter extends ChatAdapter {

    public static readonly FAKE_USER_ID = 997; // in our implementation we dont need logged user id attached

    private openedWindows: Map<string, string>;

    constructor(private chatService: ChatService) {
        super();
        chatService.ready$.subscribe({next: _ => this.initChatMessageHandler()});
        this.openedWindows = new Map();
    }

    initChatMessageHandler() {
        this.chatService.messageReceived$.subscribe({
            next: (message: EdgeChatMessage) => this.handleMessage(message)
        });
    }

    handleMessage(msg: EdgeChatMessage): void {
        const adaptedMessage: Message = new Message();
        adaptedMessage.fromId = msg.senderId;
        adaptedMessage.toId = EdgeChatAdapter.FAKE_USER_ID;
        adaptedMessage.message = msg.message;
        adaptedMessage.dateSent = msg.date;

        const otherUser: EdgeUser = EdgeUser.of(msg.senderUsername, adaptedMessage.fromId);
        this.openedWindows.set(msg.senderId, msg.senderUsername);
        this.onMessageReceived(otherUser, adaptedMessage);
    }

    getMessageHistory(destinataryId: any): Observable<Message[]> {
        return new Observable(subscriber => {
            this.chatService.socket.emit('get', {userId: destinataryId}, (response: any) => {
                if (response === undefined || response === "no history found" || response.error) {
                    subscriber.next([]);
                    return;
                }
                subscriber.next(this.parseMessageHistory(response, destinataryId));
            })
        });
    }

    sendMessage(message: Message): void {
        const messageWithUsername = new EdgeChatMessage(message.fromId, message.toId,
            message.message, new Date(), this.openedWindows.get(message.toId)!);
        this.chatService.emitPostMessage(messageWithUsername);
    }

    public registerChatWindow(user: User): void {
        this.openedWindows.set(user.id, user.displayName);
    }

    private parseMessageHistory(fullHistory: EdgeChatHistory[], destinatoryId: string): Message[] {
        if (fullHistory.length === 0) {
            return [];
        }
        const currentHistory = fullHistory[0];
        const currentUser = currentHistory.users.find(user => user.userId !== destinatoryId);
        return currentHistory.history.map((entry: ChatHistoryMessage) => {
            const message = new Message();
            message.fromId = currentUser?.id === entry.senderPos ? EdgeChatAdapter.FAKE_USER_ID : destinatoryId;
            message.toId = currentUser?.id === entry.senderPos ? destinatoryId : EdgeChatAdapter.FAKE_USER_ID;
            message.message = entry.message;
            message.dateSent = entry.timeAndData;
            return message;
        })
    }

    // not needed by us as we have our own friends panel
    listFriends(): Observable<ParticipantResponse[]> {
        return of([]);
    }
}
