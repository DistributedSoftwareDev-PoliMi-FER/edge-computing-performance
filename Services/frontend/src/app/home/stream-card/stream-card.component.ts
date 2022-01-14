import {Component, Input} from '@angular/core';

import {StreamMetadata} from "../../shared/model/stream-model";
import {Router} from "@angular/router";

@Component({
    selector: 'edge-stream-card',
    templateUrl: './stream-card.component.html',
    styleUrls: ['./stream-card.component.scss']
})
export class StreamCardComponent {

    @Input()
    stream!: StreamMetadata;

    @Input()
    private: boolean = false;

    constructor(private router: Router) {
    }

    navigateToStream() {
        this.router.navigate(['stream', this.stream._id]);
    }

}
