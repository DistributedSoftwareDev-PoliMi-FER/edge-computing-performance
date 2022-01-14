import * as jose from 'jose';
import { AUTH0_KEY } from './global-parameters';

export interface Auth0Authentication {
	getAuth0Key() : Promise<jose.KeyLike | Uint8Array>;
	authenticate(token: string) : Promise<string | undefined>;
}

export class Auth0AuthenticationReal implements Auth0Authentication {
	async getAuth0Key() {
		return await jose.importJWK({
			kty: 'RSA',
			e: 'AQAB',
			n: 'ug1eX6da6CW79QjuWlefD8ZtgCywfBi-SPr0qdw1L-_BOn811rdbBueJkSsQRMRBg4NUK78fRbPSGzcdZuxPyWL9bK8drZyxQMbhPHFTh6jg4WAizMb0DnNXBBXNNbbnr41S5cnw4DvSLPmF7ezaIPpRz4mgCnb-ydyYuAe1NvpKUl_9ZdbQCWV6Xa6Y8l4iLA9RXUUw7LqkJXsf6pEPkhEoKsIcRKRAau2nQwJ1jqIgZ3RDo0prALrJdD0EuXmNjKnfM3yguOy3Ae31J88Uq6_leeNYopd74v0LMg17AP2QfYIzms4Qr9UUnm67RO59uFRNUKLPT54BqydKrn-mOw',
		}, 'PS256');
	}

	async authenticate(token: string) {
		return (await jose.jwtVerify(token, AUTH0_KEY, {
			issuer: 'https://polimi-edge-computing.eu.auth0.com/',
			audience: 'ecp.api',
		})).payload.sub;
	}
}

export class Auth0AuthenticationMocked implements Auth0Authentication {
	async getAuth0Key() {
		return new Uint8Array();
	}
	async authenticate(token: string) {
		return token;
	}
}
