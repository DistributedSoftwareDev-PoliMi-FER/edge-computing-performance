import { Request, Response, NextFunction } from 'express';
import { RestError } from '../utils/errors';

export function exceptionHandlerMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
	handleErrors(err, res);
}


function handleErrors(e: any, res: Response) {
	if(e instanceof RestError){
		res.statusCode = e.statusCode;
		res.json(e);
	}
	else {
		res.statusCode = 500;
		res.json(new RestError('Internal server error'));
	}
}