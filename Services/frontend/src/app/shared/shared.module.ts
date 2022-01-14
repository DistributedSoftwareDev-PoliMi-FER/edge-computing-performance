import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from "@angular/material/button";

import {NotFoundComponent} from './not-found/not-found.component';
import {NavbarComponent} from './navbar/navbar.component';

@NgModule({
    declarations: [
        NavbarComponent,
        NotFoundComponent
    ],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        RouterModule
    ],
    exports: [
        NavbarComponent
    ]
})
export class SharedModule {
}
