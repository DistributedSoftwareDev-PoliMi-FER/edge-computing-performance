import * as express from 'express';
import { router } from './routes/rest-routes';
import { k8sRouter } from './routes/k8s-router';
import { connectionDB } from './db/db-access';
import { apiRouter } from './routes/api-router';

export function start(app: any, port: any, db: string){
	connectionDB(db);
	app.set('trust proxy', true);
	app.use(express.json());
	app.use('/', apiRouter);
	app.use('/', router);
	app.use('/', k8sRouter);

	app.listen(port, () => {
		console.log('listening on port: ' + port); 
	});
}