import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";

import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from "@angular/material/icon";
import {MatDialogModule} from "@angular/material/dialog";

import {PanelComponent} from './panel/panel.component';
import {MessageOverviewComponent} from './panel/message-overview/message-overview.component';
import {UserLookupComponent} from './panel/user-lookup/user-lookup.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
    declarations: [
        PanelComponent,
        MessageOverviewComponent,
        UserLookupComponent
    ],
    exports: [
        PanelComponent,
        CommonModule
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDividerModule,
        MatDialogModule,
        MatProgressSpinnerModule
    ],
    providers: [],

})
export class ChatModule {
}
