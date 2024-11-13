import { Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import config from "../../config";

export enum TOKEN_TYPE {
	RESET_PASSWORD = "RESET_PASSWORD",
	ACCESS_TOKEN = "ACCESS_TOKEN",
}

export interface AccessTokenPayload {
	userId: Types.ObjectId;
	workspaceId: Types.ObjectId;
	permissionId: Types.ObjectId;
	email: string;
	type: TOKEN_TYPE;
}

export interface AccessToken extends AccessTokenPayload {
	exp: number;
}

export function signAccessToken(payload: AccessTokenPayload) {
	return jwt.sign(payload, config.JWT_ACCESS_TOKEN_SECRET, {
		// 86400 is 1 day in seconds
		expiresIn: config.JWT_ACCESS_TOKEN_EXPIRY * 86400,
	});
}

export function verifyAccessToken(token: string) {
	return jwt.verify(token, config.JWT_ACCESS_TOKEN_SECRET) as AccessToken;
}

export const hashPassword = async (password: string) => {
	return await bcrypt.hash(password, 12);
};

export const comparePassword = async (
	password: string,
	hashedPassword: string
) => {
	return await bcrypt.compare(password, hashedPassword);
};
