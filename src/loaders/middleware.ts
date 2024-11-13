import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import AppError, { ErrorTypeE } from "../library/exception";

import { verifyAccessToken } from "../app/user/user.helper";

import { IUserDoc } from "../app/user/user.model";
import { IWorkspaceDoc } from "../app/workspace/workspace.model";
import {
	IPermissionDoc,
	ResourceE,
	ActionE,
	IAccess,
} from "../app/permission/permission.model";

import { getUserById } from "../app/user/user.repository";
import { getWorkspaceById } from "../app/workspace/workspace.repository";
import { getPermissionById } from "../app/permission/permission.repository";

export const authentication = (
	request: Request,
	response: Response,
	next: NextFunction
) => {
	return new Promise<void>(async (resolve, reject) => {
		try {
			const authHeader = request.headers.authorization as string;
			const token = authHeader.split(" ")[1];

			if (!token) {
				reject(
					new AppError(
						ErrorTypeE.UNAUTHORIZED_REQUEST,
						"UNAUTHORIZED",
						httpStatus.UNAUTHORIZED
					)
				);
				return null;
			}

			const payload = verifyAccessToken(token);

			if (payload) {
				const user = await getUserById(payload.userId);
				const workspace = await getWorkspaceById(payload.workspaceId);
				const permission = await getPermissionById(payload.permissionId);

				if (!user) {
					reject(
						new AppError(
							ErrorTypeE.UNAUTHORIZED_REQUEST,
							"UNAUTHORIZED",
							httpStatus.UNAUTHORIZED
						)
					);
					return null;
				}

				if (!workspace) {
					reject(
						new AppError(
							ErrorTypeE.UNAUTHORIZED_REQUEST,
							"UNAUTHORIZED",
							httpStatus.UNAUTHORIZED
						)
					);
					return null;
				}

				if (!permission) {
					reject(
						new AppError(
							ErrorTypeE.UNAUTHORIZED_REQUEST,
							"UNAUTHORIZED",
							httpStatus.UNAUTHORIZED
						)
					);
					return null;
				}

				response.locals["user"] = user as IUserDoc;
				response.locals["workspace"] = workspace as IWorkspaceDoc;
				response.locals["permission"] = permission as IPermissionDoc;

				resolve();
				return null;
			}

			reject(
				new AppError(
					ErrorTypeE.UNAUTHORIZED_REQUEST,
					"UNAUTHORIZED",
					httpStatus.UNAUTHORIZED
				)
			);
			return null;
		} catch (error) {
			reject(
				new AppError(
					ErrorTypeE.UNAUTHORIZED_REQUEST,
					"UNAUTHORIZED",
					httpStatus.UNAUTHORIZED
				)
			);
			return null;
		}
	})
		.then(() => {
			next();
		})
		.catch((error) => {
			next(error);
		});
};

export const authorization = (resource: ResourceE, actions: ActionE[]) => {
	return (_request: Request, response: Response, next: NextFunction) => {
		return new Promise<void>(async (resolve, reject) => {
			try {
				const permissions = response.locals["permission"] as IPermissionDoc;

				if (permissions) {
					const result = permissions.access.reduce(
						(accum: boolean, value: IAccess) => {
							if (value.resource === resource) {
								return actions.every((action: string) =>
									value.actions.includes(action as ActionE)
								);
							}
							return accum;
						},
						false
					);
					if (result) {
						resolve();
					}
				}
				reject(
					new AppError(
						ErrorTypeE.UNAUTHORIZED_REQUEST,
						"UNAUTHORIZED",
						httpStatus.UNAUTHORIZED
					)
				);
				return null;
			} catch (error) {
				reject(
					new AppError(
						ErrorTypeE.UNAUTHORIZED_REQUEST,
						"UNAUTHORIZED",
						httpStatus.UNAUTHORIZED
					)
				);
				return null;
			}
		})
			.then(() => {
				next();
			})
			.catch((error) => {
				next(error);
			});
	};
};
