import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {DOCUMENT} from "@angular/common";

import {AuthService} from "@auth0/auth0-angular";


@Component({
    selector: 'edge-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

    @Output() chatToggled: EventEmitter<any> = new EventEmitter();

    constructor(public auth: AuthService,
                @Inject(DOCUMENT) private doc: Document,) {
    }

    loginWithRedirect(): void {
        this.auth.loginWithRedirect();
    }

    logout(): void {
        this.auth.logout({ returnTo: this.doc.location.origin + "/welcome" });
    }

    public emitToggle(): void {
        this.chatToggled.emit();
    }
}
