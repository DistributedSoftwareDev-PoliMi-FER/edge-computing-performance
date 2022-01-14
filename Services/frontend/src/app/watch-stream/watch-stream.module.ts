import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';

import {VgCoreModule} from '@videogular/ngx-videogular/core';
import {VgControlsModule} from '@videogular/ngx-videogular/controls';
import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';
import {VgStreamingModule} from '@videogular/ngx-videogular/streaming';

import {StreamViewComponent} from './stream-view/stream-view.component';
import {PlayerComponent} from './player/player.component';

@NgModule({
    declarations: [
        StreamViewComponent,
        PlayerComponent,
    ],
    imports: [
        CommonModule,
        BrowserModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule,
        VgStreamingModule,
    ]
})
export class WatchStreamModule {
}
