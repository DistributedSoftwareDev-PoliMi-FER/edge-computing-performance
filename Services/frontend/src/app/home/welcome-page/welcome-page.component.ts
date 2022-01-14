import { Component, OnInit } from '@angular/core';
import {AuthService} from "@auth0/auth0-angular";

@Component({
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent {

  constructor(public auth: AuthService) {}

  loginWithRedirect(): void {
    this.auth.loginWithRedirect();
  }

}
