import httpStatus from "http-status";
import * as util from "util";

import Logger from "./logger";

export enum ErrorTypeE {
	GENERAL_ERROR = "GENERAL_ERROR",

	VALIDATION_ERROR = "VALIDATION_ERROR",

	UNAUTHORIZED_REQUEST = "UNAUTHORIZED_REQUEST",

	INVALID_REQUEST_ENDPOINT = "INVALID_REQUEST_ENDPOINT",
	INVALID_EMAIL_OR_PASSWORD = "INVALID_EMAIL_OR_PASSWORD",

	WORKSPACE_ALREADY_EXISTS = "WORKSPACE_ALREADY_EXISTS",
}

class AppError extends Error {
	constructor(
		public type: ErrorTypeE,
		public override message: string,
		public HTTPStatus: number = 500
	) {
		super(message);
	}
}

const normalizeError = (errorToHandle: unknown): AppError => {
	if (errorToHandle instanceof AppError) {
		return errorToHandle;
	}

	if (errorToHandle instanceof Error) {
		const appError = new AppError(
			ErrorTypeE.VALIDATION_ERROR,
			errorToHandle.message,
			httpStatus.INTERNAL_SERVER_ERROR
		);
		if (errorToHandle.stack) {
			appError.stack = errorToHandle.stack;
		}
		return appError;
	}

	const inputType = typeof errorToHandle;
	return new AppError(
		ErrorTypeE.GENERAL_ERROR,
		`Error Handler received a none error instance with type - ${inputType}, value - ${util.inspect(
			errorToHandle
		)}`,
		httpStatus.INTERNAL_SERVER_ERROR
	);
};

export const HandleError = (errorToHandle: unknown): void => {
	const appError: AppError = normalizeError(errorToHandle);
	Logger.error(appError.message);
};

export default AppError;
