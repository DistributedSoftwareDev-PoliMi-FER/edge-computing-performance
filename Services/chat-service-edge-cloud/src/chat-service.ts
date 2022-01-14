import * as express from 'express';
import { connectionDB } from './db/db-access';
import { apiRouter } from './routes/api-router';
import { k8sRouter } from './routes/k8s-router';
import { router } from './routes/rest-router';



//This fnction starts the chat service
export function startChatEdgeNodeService(app: express.Application, db: string, port: any){
	connectionDB(db);

	app.use(express.json());
	app.use('/', apiRouter);
	app.use('/', k8sRouter);
	app.use('/', router);

	app.listen(port, () => {
		console.log('chat service for edge node is listening on port: ' + port); 
	});
}