import * as express from 'express';
import * as http from 'http';
import * as socketIo from 'socket.io';
import { k8sRouter } from './routes/k8s-router';
import { connectionDB } from './db/db-access';
import * as wsController from './controllers/ws-controller';
import {isStressTesting, isTesting } from './utils/global-value';


export function startChatCloudService(server: http.Server, app: express.Application, db: string, port: any){
	connectionDB(db);
	
	if(process.env.TESTING as string === 'true'){
		isTesting();
		isStressTesting();
	}
	app.use('/', k8sRouter);

	const websocket = new socketIo.Server(server, {cors: {origin: '*'}});  // Cors is only for development purpose

	websocket.on('connection', wsController.onConnect);

	server.listen(port, () => {
		console.log('chat service for cloud is listening on port: ' + port);
	});
}