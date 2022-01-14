import { Response, Request, NextFunction } from 'express';
import { socketsManager } from '../chat-service';
import { Message } from '../model/Message';
import { hashString } from '../utils/crypto';
import { ErrorCode, RestError } from '../utils/errors';
import { M2M_AUTH_PW } from '../utils/global-parameters';


export async function post(req: Request, res: Response, next: NextFunction) {
	console.log('received message on REST endpoint: ' + req.body.message);

	// Check authentication
	if(req.body.pw !== hashString(M2M_AUTH_PW)) {
		console.error('the request I received is unauthorized:\n\thash in body:\t' + req.body.pw + '\n\tmy hash:\t' + hashString(M2M_AUTH_PW));
		next(new RestError('Unauthorized', ErrorCode.UNAUTHORIZED_ERROR, 401));
		return;
	}

	// Deserialize the JSON message
	let message: Message = new Message('', '', '', '', '');
	try {
		message = Message.validateRest(req.body.message);
	}
	catch (error) {
		console.error('message format error\n\t' + error);
		next(new RestError('Message format not valid', ErrorCode.REQUEST_BODY_ERROR, 415));
	}

	// Try to deliver the message to a local user (since another node asked you to do so). If you cannot return an error.
	try {
		await socketsManager.sendToLocal(message);
		res.status(200).json('Message delivered');
	}
	catch (err) {
		next(err);
	}
}