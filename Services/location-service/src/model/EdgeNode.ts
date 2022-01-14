import { getIpData } from '../utils/ip-localization-util';
import { body, validationResult } from 'express-validator';
import { NextFunction, Response } from 'express';
import { RestError, validationErrorsToRestError } from '../utils/errors';


export interface IEdgeNode {
    _id: string,
    publicIp: string,
    country: string,
    region: string
}


export class EdgeNode implements IEdgeNode {
    
	_id!: string;
	publicIp!: string;
	country!: string;
	region!: string;
    
	public static createByInterface(edgeNode: IEdgeNode) {
		const res = new EdgeNode();
		res._id = edgeNode._id;
		res.publicIp = edgeNode.publicIp;
		res.country = edgeNode.country;
		res.region = edgeNode.region;
		return res;
	}

	public static async createByIdIp(id: string, publicIp: string) {
		const res = new EdgeNode();
		res._id = id;
		res.publicIp = publicIp;
        
		const data = await getIpData(publicIp);
		res.country = data.country;
		res.region = data.region;

		return res;
	}

	public static createByFull(id: string, publicIp: string, country: string, region: string) {
		const res = new EdgeNode();
		res._id = id;
		res.publicIp = publicIp;
		res.country = country;
		res.region = region;
		return res;
	}

}


// Implements the functions to validate an http request containing a JSON with id and ip of an edge node
export abstract class EdgeNodeValidator {

	//Validation schema
	public static constraints() {
		return [
			body('id', 'id missing').exists().isString(),
		];
	}

	//Checks if the validation is ok and if so makes the req object an EdgeNode
	public static async validate(req: any, res: Response, next: NextFunction) {
		const errors = validationResult(req);

		if(errors.isEmpty()) {
			try {
				res.locals.reqObject = await EdgeNode.createByIdIp(req.body.id, req.ip);
			}
			catch (err) {
				res.status((err as RestError).statusCode).json(err);
				return;
			}
			return next();
		}
    
		res.status(400).json(validationErrorsToRestError(errors));
	}
    
}


export abstract class IdValidator {
	//Validation schema
	public static constraints() {
		return [
			body('id', 'id missing').exists().isString(),
		];
	}
    
	//Checks if the validation is ok and if so makes the req object a string
	public static validate(req: any, res: Response, next: NextFunction) {
		const errors = validationResult(req);
    
		if(errors.isEmpty()) {
			res.locals.reqObject = req.body.id;
			return next();
		}
        
		res.status(400).json(validationErrorsToRestError(errors));
	}
}