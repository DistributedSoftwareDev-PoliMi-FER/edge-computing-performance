import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

import {catchError, EMPTY, map, Observable, tap, timeout} from "rxjs";

import {environment as env} from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    private nodes: string[] = [env.baseDomain];
    private readonly LOCATION_TIMEOUT = 5000;

    constructor(private http: HttpClient) {
    }

    get serverAddress(): string {
        return this.nodes[0];
    }

    get httpServerAddres(): string {
        if (this.nodes[0].startsWith('http')) {
            return this.nodes[0];
        } else{
            return 'http://' + this.nodes[0];
        }
    }

    // function connects to the localisation service and awaits for an array of strings
    // each string in this array is an edge node that the client may connect to
    // nodes are sorted from the 'best' to the 'worst' (by location)
    // in case of error client connects to the cloud server (base url)
    public connectToEdgeNode(): Observable<any> {
        if (window.confirm('Do you want to turn on edge routing?')) {
            return this.http.get<string[]>("/api/location-service/")
                .pipe(
                    timeout(this.LOCATION_TIMEOUT),
                    map(nodes => {
                        return nodes.map(node => node + ':8080')
                    }),
                    tap( nodes  => {
                        console.log("Obtained nodes...");
                        console.log(nodes);
                        this.nodes = nodes;
                    }),
                    catchError(err => {
                        console.log(err);
                        console.log("No nodes found close to you. Falling back to the cloud routing.")
                        this.nodes = [env.baseDomain];
                        return EMPTY;
                    })
                );
        } else {
            console.log("Edge routing disabled.")
            this.nodes = [env.baseDomain];
            return EMPTY;
        }

    }

}
