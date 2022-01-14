import * as nodeUserManager from './node-user-manager';
import * as express from 'express';
import * as global from './utils/global-value';

const app = express();
const port = process.env.HTTP_PORT;

const dbAddress: string = (process.env.NODE_ENV as string);   // Take the url of the db from the evironment variable

if(dbAddress === 'production'){
	nodeUserManager.start(app, port, process.env.MONGODB_URL as string);
}
else {
	nodeUserManager.start(app, 2900, global.DB);
}
