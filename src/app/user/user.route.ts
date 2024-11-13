import express, { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import { Types } from "mongoose";

import replaceObjectId from "../../library/replaceObjectId";

import { authentication } from "../../loaders/middleware";

import { IUserDoc } from "./user.model";
import { IWorkspaceDoc } from "../workspace/workspace.model";
import { IPermissionDoc } from "../permission/permission.model";

import * as userService from "./user.service";

export default function defineUserRoutes(expressApp: express.Application) {
	const userRouter = express.Router();

	userRouter.get(
		"/",
		authentication,
		async (_request: Request, response: Response, next: NextFunction) => {
			try {
				const workspace = response.locals["workspace"] as IWorkspaceDoc;

				const users = await userService.getAllUsers(
					workspace._id as Types.ObjectId
				);

				response.status(httpStatus.OK).send({ success: true, users });
			} catch (error) {
				next(error);
			}
		}
	);

	userRouter.post(
		"/login",
		async (request: Request, response: Response, next: NextFunction) => {
			try {
				const { email, password } = request.body;
				const result = await userService.loginUser(email, password);
				response.status(httpStatus.OK).send({ success: true, ...result });
			} catch (error) {
				next(error);
			}
		}
	);

	userRouter.get(
		"/me",
		authentication,
		async (_request: Request, response: Response, next: NextFunction) => {
			try {
				const user = response.locals["user"] as IUserDoc;
				const workspace = response.locals["workspace"] as IWorkspaceDoc;
				const permission = response.locals["permission"] as IPermissionDoc;

				response.status(httpStatus.OK).send({
					success: true,
					user: replaceObjectId(user),
					workspace: replaceObjectId(workspace),
					permission: replaceObjectId(permission),
				});
			} catch (error) {
				next(error);
			}
		}
	);

	expressApp.use("/api/v1/user", userRouter);
}
