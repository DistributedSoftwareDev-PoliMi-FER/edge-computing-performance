import { NextFunction, Request, Response } from 'express';
import * as userNodeManagerService from '../services/user-node-manager-service';
import * as db from '../db/db-access';
import { RestError } from '../utils/errors';

// I have to manage the get request
export async function get(req: Request, res: Response, next: NextFunction){
	console.log('GET request');
	const idUser: string = req.params.idUser;

	console.log('idUser is: ' + idUser);

	try {
		const userEdgenode = await db.findUserInfo(idUser);
		res.status(200).json(userEdgenode);
	}
	catch (err){
		res.status((err as RestError).statusCode).json(err);
		return;
	}
}

export async function post(req: Request, res: Response, next: NextFunction){
	console.log('POST request, the body request id: ');
	console.log(res.locals.reqObject);
	try {
		await userNodeManagerService.addUserEdgeNode(res.locals.reqObject); 
		res.status(201).json(res.locals.reqObject);
	}
	catch (err){
		res.status((err as RestError).statusCode).json(err);
		return;
	}
}

export async function delByUser(req: Request, res: Response, next: NextFunction){
	console.log('DELETE request by user (endpoint /user/), the body request id: ');
	console.log(res.locals);
	try {
		await userNodeManagerService.delUserEdgeNode(res.locals.idUser);
		res.sendStatus(200);
	}
	catch (err){
		res.status((err as RestError).statusCode).json(err);
		return;
	}
}

export async function delByEdgeNode(req:Request, res: Response, next: NextFunction) {
	console.log('DELETE request by edgenode (endpoint /node/), the body request id: ');
	console.log(res.locals);
	try {
		await userNodeManagerService.delEdgeNode(res.locals.ipEdgenode);
		res.sendStatus(200);
	}
	catch (err){
		res.status((err as RestError).statusCode).json(err);
		return;
	}
}


export async function delByAll(req:Request, res: Response, next: NextFunction) {
	console.log('DELETE request by all (endpoint /ByAll/). the body request id: ');
	console.log(res.locals.reqObject);
	try {
		await userNodeManagerService.delByUserAndEdgeNode(res.locals.reqObject.idUser, res.locals.reqObject.ipEdgenode);
		res.sendStatus(200);
	}
	catch (err){
		res.status((err as RestError).statusCode).json(err);
		return;
	}
}

export async function put(req: Request, res: Response, next: NextFunction){
	console.log('PUT request, the body request id: ');
	console.log(res.locals.reqObject);
	try {
		await userNodeManagerService.updateUserEdgeNode(res.locals.reqObject);
		res.sendStatus(201);
	}
	catch (err){
		res.status((err as RestError).statusCode).json(err);
		return;
	}
}


