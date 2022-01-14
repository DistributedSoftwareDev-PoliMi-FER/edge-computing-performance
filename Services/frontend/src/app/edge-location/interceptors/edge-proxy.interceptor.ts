import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs';

import {LocationService} from "../services/location.service";

// this interceptor catches the API requests and routes them to the edge node that the client is connected to
@Injectable()
export class EdgeProxyInterceptor implements HttpInterceptor {

    constructor(private locationService: LocationService) {
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const url = this.changeUrlDomain(request.url, this.locationService.serverAddress);
        const clonedRequest = request.clone({url: url});
        console.log("Old url: " + request.url + ", new url: " + clonedRequest.url);

        return next.handle(clonedRequest);
    }

    public changeUrlDomain(oldRequestUrl: string, newDomain: string): string {
        if (oldRequestUrl.startsWith('http')) {
            return oldRequestUrl;
        } else {
            return newDomain.startsWith('http')
                ? newDomain + oldRequestUrl
                : 'http://' + newDomain + oldRequestUrl;
        }
    }
}
