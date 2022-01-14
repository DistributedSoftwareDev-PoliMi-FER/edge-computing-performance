import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

import {StreamService} from "../../shared/services/stream.service";
import {NewStream} from "../../shared/model/stream-model";

@Component({
    templateUrl: './create-stream.component.html',
    styleUrls: ['./create-stream.component.scss']
})
export class CreateStreamComponent implements OnInit {

    isLoading: boolean = true;

    constructor(private streamService: StreamService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.streamService.getUserStream().subscribe({
            next: _ => this.router.navigate(['updateStream']),
            error: (err: HttpErrorResponse) => {
                if (err.status !== 404) {
                    this.router.navigate(['home']);
                }
                this.isLoading = false;
            }
        })
    }

    onSubmit(dto: NewStream): void {
        this.streamService.createStream(dto)
            .subscribe({
                next: _ => this.router.navigate(['userStream']),
                error: err => console.log(err)
            });
    }

    onCancel() {
        this.router.navigate(['home']);
    }
}
