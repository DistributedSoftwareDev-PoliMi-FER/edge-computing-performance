import {Injectable} from '@angular/core';

import {AuthService} from "@auth0/auth0-angular";
import * as io from 'socket.io-client';
import {filter, from, Observable, Subject, switchMap} from "rxjs";
import {User} from "ng-chat";

import {EdgeChatMessage} from "../model/EdgeChatMessage";
import {LocationService} from "../../edge-location/services/location.service";
import {environment} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    public ready$: Observable<boolean>;
    public messageReceived$!: Observable<EdgeChatMessage>;
    public messagePosted$!: Observable<EdgeChatMessage>;
    public chatOpened$: Subject<User> = new Subject<User>();
    public socket!: any;

    private readonly messagePostedSub$: Subject<EdgeChatMessage>;
    private readonly readySub$: Subject<boolean>;

    constructor(private authService: AuthService,
                private location: LocationService) {
        this.readySub$ = new Subject<boolean>();
        this.ready$ = from(this.readySub$);

        this.messagePostedSub$ = new Subject<EdgeChatMessage>();
        this.messagePosted$ = from(this.messagePostedSub$);

        this.initConnection();
    }

    emitPostMessage(message: EdgeChatMessage) {
        this.socket.emit('post', {receiverId: message.receiverId, message: message.message});
        this.messagePostedSub$.next(message);
    }

    private initConnection(): void {
        this.authService.isLoading$.pipe(
            filter(state => !state),
            switchMap(v => this.authService.getAccessTokenSilently())
        ).subscribe({
            next: token => {
                const serverAddress = this.location.serverAddress.startsWith('http')
                    ? this.location.serverAddress
                    : 'http://' + this.location.serverAddress;
                this.socket = io.io(serverAddress, {
                    extraHeaders: {
                        Authorization: 'Bearer ' + token
                    },
                    path: "/api/chat-service/socket.io/"
                });
                this.initializeGlobalListeners()
                    .then(() => this.socket.on('connection_report', (_: string) => {
                        this.readySub$.next(true);
                    }));
            }
        });
    }

    private initializeGlobalListeners(): Promise<void> {
        return new Promise((resolve, _) => {
            this.receiveChatMessage();
            resolve();
        });
    }

    private receiveChatMessage(): void {
        const messageSub = new Subject<EdgeChatMessage>()
        const messageObservable = from(messageSub);

        this.socket.on('chat_message', (x: EdgeChatMessage) => {
            messageSub.next(x);
        });
        this.messageReceived$ = messageObservable;
    }
}
