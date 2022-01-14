import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

import {UserStream} from "../../shared/model/stream-model";
import {StreamService} from "../../shared/services/stream.service";


@Component({
    templateUrl: './manage-stream.component.html',
    styleUrls: ['./manage-stream.component.scss']
})
export class ManageStreamComponent implements OnInit {

    userStream!: UserStream;
    userId!: string;

    constructor(private route: ActivatedRoute,
                private streamService: StreamService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.userStream = this.route.snapshot.data['userStream'];
    }

    updateStream(): void {
        this.router.navigateByUrl('updateStream');
    }

    deleteStream(): void {
        if (confirm("Are you sure you want to delete your stream?")) {
            this.streamService.deleteStream()
                .subscribe({
                    next: _ => window.location.reload(),
                    error: err => console.log(err),
                    complete: () => window.location.reload()
                })
        }
    }
}
