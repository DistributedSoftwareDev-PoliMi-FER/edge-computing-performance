import { NextFunction, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { validationErrorsToRestError } from '../utils/errors';


export interface MessageToSaveStruct{
    senderPos: number;
    timeAndData: object;
    message: string;
}

/**
 * @swagger
 * definitions:
 *   MessageToSave:
 *       type: object
 *       required: [senderPos, timeAndData, message]
 *       properties:
 *         senderPos:
 *           type: number
 *         timeAndData:
 *           type: object
 *           format: date-time
 *         message:
 *           type: string
 */

// This class is used to save messages in the database
export class MessageToSave implements MessageToSaveStruct{
	senderPos!: number;
	timeAndData!: object;
	message!: string;

	public static createMessage(senderPos: number, message: string, date: Date){
		const mess = new MessageToSave();

		mess.senderPos = senderPos;
		mess.timeAndData = date;
		mess.message = message;
		
		return mess;
	}
}

/**
 * @swagger
 * definitions:
 *   Message:
 *     type: object
 *     required: [senderId, receiverId, message, date]
 *     properties:
 *       senderId:
 *         type: string
 *       receiverId:
 *         type: string
 *       message:
 *         type: string
 *       date:
 *         type: string
 *         format: date-time
 */

export abstract class MessageValidator{

	public static constrains() {
		return [
			body('senderId', 'sender id is missing').exists().isString(),
			body('receiverId', 'receiver id is missing').exists().isString(),
			body('message', 'message is missing').exists().isString(),
			body('date', 'date is missing').exists().isString(),
		];
	}

	public static validate(req: any, res: Response, next: NextFunction){
		const errors = validationResult(req);

		if(errors.isEmpty()){
			res.locals.messageObject = req.body;
			return next();
		}
		
		res.status(400).json(validationErrorsToRestError(errors));
	}
}