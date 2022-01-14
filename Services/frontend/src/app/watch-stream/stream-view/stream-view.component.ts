import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

import {StreamService} from "../../shared/services/stream.service";
import {StreamMetadata} from "../../shared/model/stream-model";
import {LocationService} from "../../edge-location/services/location.service";

@Component({
    templateUrl: './stream-view.component.html',
    styleUrls: ['./stream-view.component.scss']
})
export class StreamViewComponent implements OnInit {

    streamData!: StreamMetadata;
    streamUrl!: string;

    constructor(private streamService: StreamService,
                private route: ActivatedRoute,
                private locationService: LocationService) {
    }

    ngOnInit(): void {
        this.streamData = this.route.snapshot.data['streamMetadata'];
        this.streamUrl = `${this.locationService.httpServerAddres}/api/stream/${this.streamData._id}/index.m3u8`;
    }
}
