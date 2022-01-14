import {Component} from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
    templateUrl: './documentation.component.html',
    styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent {

    baseUrl: string;

    constructor() {
        this.baseUrl = environment.baseDomain;
    }
}
