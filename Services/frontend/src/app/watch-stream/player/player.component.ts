import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'edge-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss']
})
export class PlayerComponent {

    @Input()
    streamLink!: string;

    constructor() {
    }

}
