import { Result, ValidationError } from 'express-validator';

export enum ErrorCode {
    UNKNOWN_ERROR,
    UNKNOWN_DB_ERROR, 
    CHAT_HISTORY_NOT_FOUND,
    REQUEST_BODY_ERROR,
	GET_REQUEST_ERROR,
    DATABASE_SEARCH_ERROR,
}

/**
 * @swagger
 * definitions:
 *   Errors:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: number
 *         service:
 *           type: string
 *         code:
 *           type: number
 *         message:
 *           type: string
 */

export class RestError {

	readonly statusCode: number;
	readonly service: string;
	readonly code: ErrorCode;
	readonly message: string;

	public constructor(message: string, code: ErrorCode = ErrorCode.UNKNOWN_ERROR, statusCode = 500) {
		this.statusCode = statusCode;
		this.service = 'chat service';
		this.code = code;
		this.message = message;
	}
}


export function validationErrorsToRestError(err: Result<ValidationError>) {
	const arr = err.array();
	let message = '';

	for(const e of arr) {
		message += e.msg + ', ';
	}

	return new RestError(message, ErrorCode.REQUEST_BODY_ERROR, 400);
}
