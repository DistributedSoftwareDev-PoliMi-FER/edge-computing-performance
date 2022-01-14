import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthHttpInterceptor, AuthModule} from "@auth0/auth0-angular";
import {Observable} from "rxjs";
import {NgChatModule} from "ng-chat";

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeModule} from './home/home.module'
import {SharedModule} from './shared/shared.module';
import {WatchStreamModule} from "./watch-stream/watch-stream.module";
import {environment} from "../environments/environment";
import {LocationService} from "./edge-location/services/location.service";
import {EdgeProxyInterceptor} from "./edge-location/interceptors/edge-proxy.interceptor";
import {ChatModule} from "./chat/chat.module";
import {StreamCrudModule} from './stream-crud/stream-crud.module';

function initializeAppFactory(locationService: LocationService): () => Observable<any> {
    console.log("Invoking the location service...")
    return () => locationService.connectToEdgeNode();
}

const providers: Array<any> = [
    {provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true},
];

providers.push(
    {
        provide: APP_INITIALIZER,
        useFactory: initializeAppFactory,
        deps: [LocationService],
        multi: true
    },
    {
        provide: HTTP_INTERCEPTORS, useClass: EdgeProxyInterceptor, multi: true
    }
)

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        HomeModule,
        SharedModule,
        WatchStreamModule,
        StreamCrudModule,
        ChatModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        NgChatModule,
        MatToolbarModule,
        MatSidenavModule,
        AuthModule.forRoot({
                ...environment.auth,
                httpInterceptor: {
                    allowedList: ['/api/stream/auth*', '/api/chat*']
                }
            }
        )
    ],
    providers: providers,
    bootstrap: [AppComponent]
})
export class AppModule {
}
