import httpStatus from "http-status";
import { Types } from "mongoose";

import AppError, { ErrorTypeE } from "../../library/exception";
import replaceObjectId from "../../library/replaceObjectId";

import { IUser } from "./user.model";

import * as userHelper from "./user.helper";
import * as userRepository from "./user.repository";

export const getAllUsers = async (workspaceId: Types.ObjectId) => {
	const users = await userRepository.getAllWorkspaceUsers(workspaceId);
	return replaceObjectId(users) as IUser[];
};

export const loginUser = async (email: string, password: string) => {
	const userExists = await userRepository.getUserByEmail(email);

	if (!userExists) {
		throw new AppError(
			ErrorTypeE.INVALID_EMAIL_OR_PASSWORD,
			"Invalid email address or password",
			httpStatus.BAD_REQUEST
		);
	}

	const isPasswordValid = await userHelper.comparePassword(
		password,
		userExists.passwordHash
	);

	if (!isPasswordValid) {
		throw new AppError(
			ErrorTypeE.INVALID_EMAIL_OR_PASSWORD,
			"Invalid email address or password",
			httpStatus.BAD_REQUEST
		);
	}

	const accessToken = await userHelper.signAccessToken({
		type: userHelper.TOKEN_TYPE.ACCESS_TOKEN,
		email: userExists.email,
		userId: userExists._id as Types.ObjectId,
		workspaceId: userExists.workspaceRef as Types.ObjectId,
		permissionId: userExists.permission as Types.ObjectId,
	});

	return {
		accessToken,
		user: replaceObjectId(userExists),
	};
};
