import { Result, ValidationError } from 'express-validator';

export enum ErrorCode {
    UNKNOWN_DB_ERROR, 
    ID_NOT_FOUND,
    REQUEST_BODY_ERROR,
}

export class RestError{
	readonly statusCode: number;
	readonly code: ErrorCode;
	readonly message: string;

	public constructor(code: ErrorCode, message: string, statusCode = 500) {
		this.statusCode = statusCode;
		this.code = code;
		this.message = message;
	}
}

export function validationErrorsToRestError(err: Result<ValidationError>){
	const arr = err.array();
	let message = '';

	for(const e of arr) {
		message += e.msg + ', ';
	}

	return new RestError(ErrorCode.REQUEST_BODY_ERROR, message, 400); //
}