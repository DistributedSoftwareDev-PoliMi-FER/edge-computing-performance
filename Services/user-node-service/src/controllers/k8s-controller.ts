import { NextFunction, Request, Response } from 'express';

export async function health(req: Request, res: Response, next: NextFunction){
	res.sendStatus(200);
}