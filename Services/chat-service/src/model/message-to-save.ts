import { NextFunction, Response } from 'express';
import { body, validationResult } from 'express-validator';


export interface MessageToSaveStruct{
    senderPos: number;
    timeAndData: Date;
    message: string;
}

// This class is used to save messages in the database
export class MessageToSave implements MessageToSaveStruct{
	senderPos!: number;
	timeAndData!: Date;
	message!: string;

	public static createMessage(senderPos: number, message: string, data: Date){
		const mess = new MessageToSave();

		mess.senderPos = senderPos;
		mess.timeAndData = data;
		mess.message = message;

		return mess;
	}
}


export abstract class MessageValidator{

	public static constrains() {
		return [
			body('senderId', 'sender id is missing').exists().isString(),
			body('receiverId', 'receiver id is missing').exists().isString(),
			body('message', 'message is missing').exists().isString(),
		];
	}

	public static validate(req: any, res: Response, next: NextFunction){
		const errors = validationResult(req);

		if(errors.isEmpty()){
			try {
				res.locals.messageObject = req.body;
			}
			catch (err){
				console.log(err);
				return;
			}
			return next();
		}
		console.log(errors);
	}
}