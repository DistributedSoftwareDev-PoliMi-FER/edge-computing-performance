import { Result, ValidationError } from 'express-validator';

export enum ErrorCode {
    UNKNOWN_ERROR,
    UNKNOWN_DB_ERROR, 
    ID_NOT_FOUND,
    REQUEST_BODY_ERROR,
    NOT_ENOUGH_NODES,
    DATABASE_SEARCH_ERROR,
    EXTERNAL_LOCATION_API_ERROR
}

export class RestError {

	readonly statusCode: number;
	readonly code: ErrorCode;
	readonly message: string;

	public constructor(message: string, code: ErrorCode = ErrorCode.UNKNOWN_ERROR, statusCode = 500) {
		this.statusCode = statusCode;
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
