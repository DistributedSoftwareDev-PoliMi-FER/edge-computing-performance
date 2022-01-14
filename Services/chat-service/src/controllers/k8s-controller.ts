import { NextFunction, Request, Response } from 'express';

export async function health(req: Request, res: Response, next: NextFunction){
	res.status(200).send('1');
}