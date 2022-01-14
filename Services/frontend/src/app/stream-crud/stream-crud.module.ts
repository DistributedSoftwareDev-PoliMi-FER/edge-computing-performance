import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatRadioModule} from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

import {UpdateStreamComponent} from './update-stream/update-stream.component';
import {ManageStreamComponent} from "./manage-stream/manage-stream.component";
import {CreateStreamComponent} from "./create-stream/create-stream.component";
import {StreamFormComponent} from "./stream-form/stream-form.component";


@NgModule({
    declarations: [
        UpdateStreamComponent,
        ManageStreamComponent,
        CreateStreamComponent,
        StreamFormComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        MatListModule,
        MatIconModule
    ]
})
export class StreamCrudModule {
}
