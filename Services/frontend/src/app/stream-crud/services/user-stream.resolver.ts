import {Resolve, Router} from "@angular/router";
import {Injectable} from "@angular/core";

import {catchError, EMPTY, map, Observable, of} from "rxjs";

import {StreamService} from "../../shared/services/stream.service";
import {StreamMetadata} from "../../shared/model/stream-model";
import {HttpErrorResponse} from "@angular/common/http";


@Injectable({providedIn: 'root'})
export class UserStreamResolver implements Resolve<StreamMetadata> {

    constructor(private service: StreamService,
                private router: Router) {
    }

    resolve(): Observable<StreamMetadata> {
        return this.service.getUserStream()
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    if (err.status != 404) {
                        this.router.navigate(['home']);
                    }
                    this.router.navigate(['createStream']);
                    return EMPTY;
                })
            );
    }
}
