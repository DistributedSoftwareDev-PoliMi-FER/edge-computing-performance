import { Result, ValidationError } from 'express-validator';

export enum ErrorCode {
    UNKNOWN_ERROR,
    REQUEST_BODY_ERROR,
	RECEIVER_USER_NOT_FOUND_ERROR,
	UNAUTHORIZED_ERROR,
	MESSAGE_FORMAT_NOT_VALID_ERROR
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
