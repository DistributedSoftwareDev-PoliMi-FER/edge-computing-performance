import config from '../../auth_config.json';

const {domain, clientId, audience} = config as {
    domain: string;
    clientId: string;
    audience: string;
};

export const environment = {
    production: true,
    auth: {
        domain,
        clientId,
        redirectUri: window.location.origin,
        audience
    },
    baseDomain: 'https://edge-computing.polimi-ecb7249.gcp.mia-platform.eu'
};
