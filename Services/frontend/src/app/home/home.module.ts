import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";

import {AppRoutingModule} from '../app-routing.module';
import {MainComponent} from './main/main.component';
import {StreamCardComponent} from './stream-card/stream-card.component';
import {WelcomePageComponent} from './welcome-page/welcome-page.component';
import { DocumentationComponent } from './documentation/documentation.component';


@NgModule({
    declarations: [
        MainComponent,
        StreamCardComponent,
        WelcomePageComponent,
        DocumentationComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        AppRoutingModule,
        FormsModule
    ]
})
export class HomeModule {
}
