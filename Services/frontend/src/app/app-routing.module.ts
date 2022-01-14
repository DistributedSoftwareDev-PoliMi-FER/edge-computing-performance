import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from "@auth0/auth0-angular";

import {MainComponent} from './home/main/main.component';
import {StreamViewComponent} from './watch-stream/stream-view/stream-view.component';
import {StreamResolver} from "./watch-stream/services/stream.resolver";
import {NotFoundComponent} from "./shared/not-found/not-found.component";
import {ManageStreamComponent} from "./stream-crud/manage-stream/manage-stream.component";
import {UserStreamResolver} from "./stream-crud/services/user-stream.resolver";
import {WelcomePageComponent} from "./home/welcome-page/welcome-page.component";
import {CreateStreamComponent} from "./stream-crud/create-stream/create-stream.component";
import {UpdateStreamComponent} from "./stream-crud/update-stream/update-stream.component";
import {DocumentationComponent} from "./home/documentation/documentation.component";

const routes: Routes = [
    {path: 'welcome', component: WelcomePageComponent},
    {path: '', component: MainComponent},
    {path: 'home', redirectTo: ''},
    {path: 'docs', component: DocumentationComponent},
    {
        path: 'stream/:id',
        component: StreamViewComponent,
        resolve: {
            streamMetadata: StreamResolver
        }
    },
    {
        path: 'userStream', component: ManageStreamComponent,
        resolve: {
            userStream: UserStreamResolver
        },
        canActivate: [AuthGuard]
    },
    {
        path: 'updateStream', component: UpdateStreamComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'createStream', component: CreateStreamComponent,
        canActivate: [AuthGuard]
    },
    {path: '**', component: NotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
