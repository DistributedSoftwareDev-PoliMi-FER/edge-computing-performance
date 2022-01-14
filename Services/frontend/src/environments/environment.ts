// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import config from '../../auth_config.json';

const {domain, clientId, audience} = config as {
    domain: string;
    clientId: string;
    audience: string;
};

export const environment = {
    production: false,
    auth: {
        domain,
        clientId,
        redirectUri: window.location.origin,
        audience
    },
    baseDomain: 'http://localhost:4200'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
