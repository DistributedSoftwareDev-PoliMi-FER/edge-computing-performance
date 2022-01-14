import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import * as webSocketController from './controllers/websocket-controller';
import { exceptionHandlerMiddleware } from './middlewares/exception-handelr-middleware';
import { businessRouter } from './routes/business-router';
import { k8sRouter } from './routes/k8s-router';
import * as businessServices from './services/business-services';
import { SocketManager } from './services/sockets-manager';
import { UnsentMessagesList } from './services/unsent-messages-list';
import { UsersCache } from './services/users-cache';
import { AxiosActions } from './utils/axios-implementations';
import * as cors from 'cors';
import { UNSENT_MESSAGES_INTERVAL } from './utils/global-parameters';

// Object to manage the users connected to this edge node
export let socketsManager: SocketManager; 

// Keeps track of the messages which we couldn't send to the master node, and retries to send them once every XXX seconds 
export let unsentMessages: UnsentMessagesList; 


// Sets up the edge node chat service.
// app: The Express engine
// axios: Interface to send http requests to other services. It can be implemented as a mocked service for testing reasons.
export function main(app: express.Express, axios: AxiosActions, portNumber: string) {
	app.use(cors());
	const server = http.createServer(app);
	const io = new socketIo.Server(server, { 
		cors: {    
			origin: '*',    
			methods: ['GET', 'POST', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
		},
		allowEIO3: true,
		transports: ['websocket', 'polling']
	});
	const usersCache = new UsersCache(axios); // Object to manage the cache (namely the userId-nodeId pairs, which tell us where to route a message directed to a user we don't manage on this node)
	socketsManager = new SocketManager(usersCache, axios);
	unsentMessages = new UnsentMessagesList(UNSENT_MESSAGES_INTERVAL, axios);
	businessServices.setAxiosImplementation(axios);
	webSocketController.setAxiosImplementation(axios);

	io.on('connection', webSocketController.onConnection);

	app.use(express.json());
	app.use('/', k8sRouter);
	app.use('/', businessRouter);

	app.use(exceptionHandlerMiddleware);

	server.listen(portNumber);
}