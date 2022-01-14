import {Component, OnInit, ViewChild} from '@angular/core';

import {IChatController, Theme} from "ng-chat";

import {EdgeChatAdapter} from "./chat/EdgeChatAdapter";
import {ChatService} from "./chat/services/chat.service";

@Component({
    selector: 'edge-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    @ViewChild('ngChatInstance')
    protected ngChatInstance!: IChatController;

    title = 'edge-conference';
    userId = EdgeChatAdapter.FAKE_USER_ID;
    theme = Theme.Dark;

    constructor(public adapter: EdgeChatAdapter,
                private chatService: ChatService) {
    }

    ngOnInit(): void {
        this.chatService.chatOpened$.subscribe({
            next: user =>{
                this.ngChatInstance.triggerOpenChatWindow(user);
                this.adapter.registerChatWindow(user);
            }
        });
    }
}
