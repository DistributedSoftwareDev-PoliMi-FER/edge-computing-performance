import { Request, Response, NextFunction } from 'express';
import { isServiceOk } from '../services/k8s-service';


export function get(req: Request, res: Response, next: NextFunction) {
	if(isServiceOk()){
		res.sendStatus(200);
	}
	else {
		res.sendStatus(503);
	}
}
