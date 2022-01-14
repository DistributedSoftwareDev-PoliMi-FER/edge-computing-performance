import { NextFunction, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import { RestError, validationErrorsToRestError } from '../utils/errors';


export interface UserEdgeNodeInterface{
    idUser: string,
    ipEdgenode: string,
}

export class UserEdgeNode implements UserEdgeNodeInterface{
	idUser!: string;
	ipEdgenode!: string;

	public static createByUserId(idUser: string, ipEdgenode: string){
		const res = new UserEdgeNode();
		res.idUser = idUser;
		res.ipEdgenode = ipEdgenode;
		return res;
	}
}

// Implements the functions to validate an http request containing a JSON with user id and  of an edge node
export abstract class IdUserEdgeNodeValidator {

	//Validation schema
	public static constraints() {
		return [
			body('idUser', 'user id missing').exists().isString()
		];
	}

	//Checks if the validation is ok and if so makes the req object an EdgeNode
	public static validate(req: any, res: Response, next: NextFunction) {
		const errors = validationResult(req);
		//Console.log(req);


		if(errors.isEmpty()) {
			try {
				const ip = req.ip;
				console.log(ip);
				res.locals.reqObject = UserEdgeNode.createByUserId(req.body.idUser, ip);
			}
			catch (err){
				res.status((err as RestError).statusCode).json(err);
				return;
			}
			return next();
		}
		//Console.log(errors);
		res.status(400).json(validationErrorsToRestError(errors));
	}    
}


export abstract class UserIdValidator {
	//Validation schema
	public static constraints() {
		return [
			body('idUser', 'id missing').exists().isString(),
		];
	}
    
	//Checks if the validation is ok and if so makes the req object a string
	public static validate(req: any, res: Response, next: NextFunction) {
		const errors = validationResult(req);
    
		if(errors.isEmpty()) {
			res.locals.idUser = req.body.idUser;
			return next();
		}
		res.status(400).json(validationErrorsToRestError(errors));
	}
}

export abstract class NodeIdValidator {
	//Validation schema
	public static constraints() {
		return [
			
		];
	}

	//Checks if the validation is ok and if so makes the req object a string
	public static validate(req: any, res: Response, next: NextFunction) {
		const errors = validationResult(req);

		if(errors.isEmpty()) {
			const ip = req.ip;
			console.log(ip);
			res.locals.ipEdgenode = ip;
			return next();
		}
		res.status(400).json(validationErrorsToRestError(errors));
	}
}