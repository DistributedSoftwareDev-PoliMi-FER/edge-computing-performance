import { Component, OnInit } from '@angular/core';
import {StreamService} from "../../shared/services/stream.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {NewStream, UserStream} from "../../shared/model/stream-model";

@Component({
  templateUrl: './update-stream.component.html',
  styleUrls: ['./update-stream.component.scss']
})
export class UpdateStreamComponent implements OnInit {

  isLoading: boolean = true;
  initStream!: UserStream;

  constructor(private streamService: StreamService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.streamService.getUserStream().subscribe({
      next: stream => {
        this.initStream = stream;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status !== 404) {
          this.router.navigate(['home']);
        }
        this.router.navigate(['createStream']);
      }
    })
  }

  onSubmit(dto: NewStream): void {
    this.streamService.updateStream(dto)
        .subscribe({
          next: _ => this.router.navigate(['userStream']),
          error: err => console.log(err)
        });
  }

  onCancel() {
    this.router.navigate(['home']);
  }
}
