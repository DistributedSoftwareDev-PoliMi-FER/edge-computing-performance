import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";

import {catchError, EMPTY, Observable} from "rxjs";

import {StreamService} from "../../shared/services/stream.service";
import {StreamMetadata} from "../../shared/model/stream-model";


@Injectable({providedIn: 'root'})
export class StreamResolver implements Resolve<StreamMetadata> {

    constructor(private service: StreamService,
                private router: Router) {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<StreamMetadata> {
        const streamId = route.paramMap.get('id');
        return this.service.getStreamById(streamId!)
            .pipe(
                catchError(err => {
                    if (err.status == 404) {
                        this.router.navigate(['notFound']);
                    } else {
                        this.router.navigate(['home'])
                    }
                    return EMPTY;
                })
            );
    }
}
