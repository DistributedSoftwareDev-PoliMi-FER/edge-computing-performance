import {Component, OnInit} from '@angular/core';

import {AuthService} from "@auth0/auth0-angular";
import {filter, switchMap} from "rxjs";

import {StreamService} from "../../shared/services/stream.service";
import {StreamMetadata} from "../../shared/model/stream-model";

@Component({
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    publicStreams: StreamMetadata[] = [];
    privateStreams: StreamMetadata[] = [];
    searchString: string = '';

    constructor(private streamService: StreamService,
                private authService: AuthService) {
    }

    ngOnInit(): void {
        this.streamService.getPublicStreams()
            .subscribe({
                next: res => {
                    this.publicStreams = res;
                },
                error: err => console.log(err)
            });
        this.streamService.getPrivateStreams().subscribe({
            next: (res: StreamMetadata[]) => {
                this.privateStreams = res;
            },
            error: err => console.log(err)
        });
    }

    isStreamVisible(streamName: string): boolean {
        if (this.searchString === '') return true;
        else return streamName.toLowerCase().startsWith(this.searchString.toLowerCase());
    }
}
