import express, { Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { Types } from "mongoose";

import replaceObjectId from "../../library/replaceObjectId";

import { authentication } from "../../loaders/middleware";

import { IWorkspaceDoc } from "../workspace/workspace.model";
import { IUserDoc } from "../user/user.model";

import * as customerServer from "./customer.service";

export default function definecustomerRoutes(expressApp: express.Application) {
	const customerRouter = express.Router();

	customerRouter.get(
		"/:id",
		authentication,
		async (request: Request, response: Response, next: NextFunction) => {
			try {
				const id: Types.ObjectId = request.params[
					"id"
				] as unknown as Types.ObjectId;

				const customer = await customerServer.getCustomer(id);

				response
					.status(httpStatus.OK)
					.send({ success: true, branch: replaceObjectId(customer) });
			} catch (error) {
				next(error);
			}
		}
	);

	customerRouter.get(
		"/",
		authentication,
		async (_request: Request, response: Response, next: NextFunction) => {
			try {
				const workspace = response.locals["workspace"] as IWorkspaceDoc;

				const customers = await customerServer.getAllcustomer(
					workspace._id as Types.ObjectId
				);

				response.status(httpStatus.OK).send({ success: true, customers });
			} catch (error) {
				next(error);
			}
		}
	);

	customerRouter.post(
		"/",
		authentication,

		async (request: Request, response: Response, next: NextFunction) => {
			try {
				const user = response.locals["user"] as IUserDoc;
				const workspace = response.locals["workspace"] as IWorkspaceDoc;

				const customer = await customerServer.createCustomer({
					...request.body,
					workspaceRef: workspace._id as Types.ObjectId,
					createdBy: user._id as Types.ObjectId,
					updatedBy: user._id as Types.ObjectId,
				});

				response.status(httpStatus.OK).send({ success: true, customer });
			} catch (error) {
				next(error);
			}
		}
	);

	customerRouter.put(
		"/:id",
		authentication,

		async (request: Request, response: Response, next: NextFunction) => {
			try {
				const user = response.locals["user"] as IUserDoc;
				const id: Types.ObjectId = request.params[
					"id"
				] as unknown as Types.ObjectId;

				const customer = await customerServer.updateCustomer(id, {
					...request.body,
					updatedBy: user._id as Types.ObjectId,
				});

				response.status(httpStatus.OK).send({ success: true, customer });
			} catch (error) {
				next(error);
			}
		}
	);

	customerRouter.delete(
		"/:id",
		authentication,
		async (request: Request, response: Response, next: NextFunction) => {
			try {
				const id: Types.ObjectId = request.params[
					"id"
				] as unknown as Types.ObjectId;

				await customerServer.deletecustomer(id);

				response.status(httpStatus.OK).send({ success: true });
			} catch (error) {
				next(error);
			}
		}
	);

	expressApp.use("/api/v1/customer", customerRouter);
}
