import * as express from 'express';
import * as http from 'http';
import * as chatService from './chat-service';
import 'dotenv/config';
import { getAuth0Token } from './utils/auth0-api';
import { changeAut0Token } from './utils/global-value';


const app = express();
const server = http.createServer(app);
getAuth0Token().then(res => {
	chatService.startChatCloudService(server, app, process.env.MONGODB_URL as string, process.env.HTTP_PORT);
	changeAut0Token(res);
});


