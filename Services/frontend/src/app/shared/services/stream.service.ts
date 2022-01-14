import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';

import {NewStream, StreamMetadata, UserStream} from '../model/stream-model';

@Injectable({
    providedIn: 'root'
})
export class StreamService {

    private readonly routes = {
        publicStreams: '/api/stream/public',
        privateStreams: '/api/stream/auth/private',
        getStream: '/api/stream/',
        userStream: '/api/stream/auth/mystream',
        createStream: '/api/stream/auth/new',
        updateStream: '/api/stream/auth/update'
    };

    constructor(private http: HttpClient) {
    }

    getPublicStreams(): Observable<StreamMetadata[]> {
        return this.http.get<StreamMetadata[]>(this.routes.publicStreams);
    }

    getPrivateStreams(): Observable<StreamMetadata[]> {
        return this.http.get<StreamMetadata[]>(this.routes.privateStreams);
    }

    getUserStream(): Observable<UserStream> {
        return this.http.get<UserStream
            >(this.routes.userStream);
    }

    getStreamById(id: string): Observable<StreamMetadata> {
        return this.http.get<StreamMetadata>(this.routes.getStream + id);
    }

    createStream(dto: NewStream): Observable<void> {
        const requestOptions: Object = {
            responseType: 'text'
        }
        return this.http.post<void>(this.routes.createStream, dto, requestOptions);
    }

    updateStream(dto: NewStream): Observable<void> {
        const requestOptions: Object = {
            responseType: 'text'
        }
        return this.http.post<void>(this.routes.updateStream, dto, requestOptions);
    }

    deleteStream(): Observable<any> {
        const requestOptions: Object = {
            responseType: 'text'
        }
        return this.http.delete<any>(this.routes.userStream,  requestOptions);
    }
}
