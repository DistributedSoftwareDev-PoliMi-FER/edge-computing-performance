import * as express from 'express';
import { connectDb } from './db/db-access';
import { start } from './location-service';
import { PORT_NUMBER, PROD_DB_CONNECTION_STRING } from './utils/global-parameters';

const app = express();
connectDb(PROD_DB_CONNECTION_STRING);
start(app, PORT_NUMBER);