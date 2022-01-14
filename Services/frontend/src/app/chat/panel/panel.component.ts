import {Component, OnInit} from '@angular/core';

import {User} from "ng-chat";
import {MatDialog} from "@angular/material/dialog";

import {ChatService} from "../services/chat.service";
import {ChatOverviewMessage} from "../model/ChatOverviewMessage";
import {UserLookupComponent} from "./user-lookup/user-lookup.component";
import {EdgeUser} from "../model/EdgeUser";
import {EdgeChatMessage} from "../model/EdgeChatMessage";

@Component({
    selector: 'edge-chat-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

    messages: ChatOverviewMessage[] = [];
    isReady = false;
    searchString = '';

    constructor(private service: ChatService,
                private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.service.ready$.subscribe({
            next: _ => {
                this.initChatOverview();
                this.initMessageHandlers();
            }
        })
    }

    onChatOpened(userOverview: ChatOverviewMessage) {
        const user: User = EdgeUser.of(userOverview.username, userOverview.userId);
        this.service.chatOpened$.next(user);
    }

    openUserLookup() {
        const ref = this.dialog.open(UserLookupComponent)
        ref.afterClosed().subscribe({
            next: (maybeUser: EdgeUser) => {
                if (maybeUser) {
                    this.service.chatOpened$.next(maybeUser);
                }
            }
        });
    }

    isChatHidden(participant: ChatOverviewMessage) {
        if (this.searchString === '') return false;
        else return !participant.username.toLowerCase().startsWith(this.searchString.toLowerCase());
    }

    private initChatOverview() {
        if (this.isReady) {
            return;
        } else {
            this.service.socket.emit('chat_overview', {}, (overview: any) => {
                if (overview === 'no history found') {
                    this.isReady = true;
                } else if (overview?.error) {
                    console.log('Error when obtaining the chat overview');
                    this.isReady = true;
                }
                else if (Array.isArray(overview)) {
                    this.isReady = true;
                    this.messages = overview.sort((msgA: EdgeChatMessage, msgB: EdgeChatMessage) => msgA?.date > msgB.date ? -1 : 1);
                }
            });
            setTimeout(() => this.initChatOverview(), 2000);
        }
    }

    private initMessageHandlers() {
        this.service.messageReceived$.subscribe({
            next: message => this.insertMessageOverview(message, message.senderId)
        });
        this.service.messagePosted$.subscribe({
            next: message => this.insertMessageOverview(message, message.receiverId)
        })
    }

    private insertMessageOverview(message: EdgeChatMessage, participantId: string) {
        const maybeOverviewIndex =  this.messages.findIndex(overviewMessage => overviewMessage.userId === participantId);
        if (maybeOverviewIndex > -1) {
            this.messages.splice(maybeOverviewIndex, 1);
        }
        this.messages.unshift({
            username: message.senderUsername, // in this case it's always the name of the other participant! this is to conform to the backend API
            userId: participantId,
            lastMessage: message.message,
            date: message.date
        });
    }
}
