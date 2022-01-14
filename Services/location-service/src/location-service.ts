import { businessRouter } from './routes/business-router';
import * as express from 'express';
import * as http from 'http';
import { exceptionHandlerMiddleware } from './middlewares/exception-handelr-middleware';
import { k8sRouter } from './routes/k8s-router';
import { apiRouter } from './routes/api-router';


let server: http.Server;

//Sets up the service
export function start(app: express.Express, portNumber: string) {
	app.enable('trust proxy'); //Used later to get the IP of the sender

	app.use(express.json());
	app.use('/', k8sRouter); //Routes for k8s monitoring
	app.use('/', businessRouter);
	app.use('/', apiRouter);

	app.use(exceptionHandlerMiddleware); //Exception handler

	server = app.listen(portNumber, () => {
		console.log(`Listening on port: ${portNumber}`); 
	});
}


export function shutDown() {
	server.close();
}
