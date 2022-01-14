import * as express from 'express';
import * as chatService from './chat-service';
import 'dotenv/config';

const app = express();

chatService.startChatEdgeNodeService(app, process.env.MONGODB_URL as string, process.env.HTTP_PORT);