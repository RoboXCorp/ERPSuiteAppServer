import express from "express";

import { AddressInfo } from "net";
import { Server } from "http";

import config from "./config";

import Logger from "./library/logger";

import connectMongoDB from "./loaders/mongoose";
import defineAPIRoutes from "./loaders/routes";

let connection: Server;

export default async function startApplicationServer(): Promise<AddressInfo> {
	const expressApp = express();

	defineAPIRoutes(expressApp);

	const APIAddress = await openConnection(expressApp);
	return APIAddress;
}

import User from "./app/user/user.model";
import { hashPassword } from "./app/user/user.helper";
import { createWorkspace } from "./app/workspace/workspace.service";
import { Types } from "mongoose";

const openConnection = async (
	expressApp: express.Application
): Promise<AddressInfo> => {
	return new Promise((resolve, reject) => {
		connection = expressApp.listen(config.PORT, async () => {
			try {
				// Connect Database
				await connectMongoDB();

				const defaultUsers = await User.find({});

				if (defaultUsers.length === 0) {
					const user = await User.create({
						name: "Ashik",
						email: "ashikroyce@gmail.com",
						passwordHash: await hashPassword("Ashik@123"),
						isDeleted: false,
					});
					await createWorkspace({
						name: "RoboX Corp",
						handle: "ROBOX_CORPORATION",

						isDeleted: false,

						createdBy: user._id as Types.ObjectId,
						updatedBy: user._id as Types.ObjectId,
					});
				}

				Logger.info("Database connected");
				resolve(connection.address() as AddressInfo);
			} catch (error) {
				console.log(error);
				reject(error);
			}
		});
	});
};
