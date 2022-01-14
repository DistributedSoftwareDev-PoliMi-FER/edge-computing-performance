import {Component, OnDestroy, OnInit} from '@angular/core';

import {MatDialogRef} from "@angular/material/dialog";

import {ChatService} from "../../services/chat.service";
import {EdgeUser} from "../../model/EdgeUser";

@Component({
    templateUrl: './user-lookup.component.html',
})
export class UserLookupComponent implements OnDestroy, OnInit {

    username: string = '';
    notFound: boolean = false;

    constructor(public dialogRef: MatDialogRef<UserLookupComponent>,
                private chatService: ChatService) {
    }

    ngOnInit(): void {
        this.chatService.socket.on('username_not_found', (err: any) => {
            this.notFound = true;
        });
    }

    ngOnDestroy(): void {
        this.chatService.socket.removeAllListeners(['username_not_found']);
    }

    back(): void {
        this.dialogRef.close();
    }

    search(): void {
        this.chatService.socket.emit("resolve_username", {username: this.username}, (response: any) => {
            if (response.userId !== undefined) {
                const user: EdgeUser = EdgeUser.of(response.username, response.userId);
                this.dialogRef.close(user);
            } else {
                this.notFound = true;
                return;
            }
        });
    }
}
