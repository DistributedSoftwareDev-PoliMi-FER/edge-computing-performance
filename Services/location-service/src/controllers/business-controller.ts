import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import * as bestNodeService from '../services/best-node-service';
import * as nodeManagerService from '../services/node-manager-service';
import { API_URL } from '../utils/global-parameters';
import { getIpData } from '../utils/ip-localization-util';


//Returns to the client the list of the best nodes to connect to
export async function get(req: Request, res: Response, next: NextFunction) {
	try {
		const ip = req.ip;
		const ipLocation = getIpData(ip);
		const nearbyNodes = await bestNodeService.getNearbyNodes(await ipLocation); //Get the nearest nodes
		const bestNodes = await bestNodeService.nearestNodesToClient(await ipLocation!, nearbyNodes!); //Get the best nodes
        
		res.status(200).json(bestNodes);
	}
	catch (err) {
		next(err);
	}
}

//Adds the new node
export async function post(req: Request, res: Response, next: NextFunction) {
	try {
		const addedNode = await nodeManagerService.addEdgeNode(res.locals.reqObject);
		res.status(201).json(addedNode);
	}
	catch (err) {
		next(err);
	}
}

//Remove specified node, if it doesn't exist an error is returned
export async function del(req: Request, res: Response, next: NextFunction) {
	try {
		const deletedNode = await nodeManagerService.deleteEdgeNode(res.locals.reqObject);
		try {
			await axios.delete(API_URL + '/node', { data: { idEdgenode: deletedNode._id } }); // Remove all the users connected to this node
		}
		catch (err) {
			// If the service was unavailable we can do nothing
		}
		res.status(200).json(deletedNode);
	}
	catch (err) {
		next(err);
	}
}

//Update specified node, if it doesn't exist it creates a new one
export async function put(req: Request, res: Response, next: NextFunction) {
	try {
		const updatedNode = await nodeManagerService.updateEdgeNode(res.locals.reqObject);
		res.status(201).json(updatedNode);
	}
	catch (err) {
		next(err);
	}
}