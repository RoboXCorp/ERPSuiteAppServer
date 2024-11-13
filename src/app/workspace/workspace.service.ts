import httpStatus from "http-status";
import { Types } from "mongoose";

import AppError, { ErrorTypeE } from "../../library/exception";

import { IWorkspace } from "./workspace.model";
import { ACTIONS, ResourceE, RESOURCES } from "../permission/permission.model";
import { DataTypeE, IProperty, ObjectE } from "../property/property.model";

import * as workspaceRepository from "./workspace.repository";
import * as permissionRepository from "../permission/permission.repository";
import * as userRepository from "../user/user.repository";
import * as propertyRepository from "../property/property.repository";

export const createWorkspace = async (data: IWorkspace) => {
	const workspaceExists = await workspaceRepository.getWorkspaceByHandle(
		data.handle
	);

	if (workspaceExists) {
		throw new AppError(
			ErrorTypeE.WORKSPACE_ALREADY_EXISTS,
			"Workspace Handle Already Exists, Please try diffrent workspace handle",
			httpStatus.BAD_REQUEST
		);
	}

	const workspace = await workspaceRepository.createWorkspace(data);

	const permission = await permissionRepository.createPermission({
		name: "Admin",
		access: RESOURCES.map((resouce) => {
			return {
				resource: resouce,
				actions: ACTIONS,
			};
		}),

		isDeleted: false,
		workspaceRef: workspace._id as Types.ObjectId,

		createdBy: data.createdBy,
		updatedBy: data.updatedBy,
	});

	await userRepository.updateUser(data.createdBy as Types.ObjectId, {
		workspaceRef: workspace._id as Types.ObjectId,
		permission: permission._id as Types.ObjectId,

		createdBy: data.createdBy,
		updatedBy: data.updatedBy,
	});

	const properties: IProperty[] = [
		// CUSTOMER PROPERTIES
		{
			label: "Name",
			propertyKey: "CUSTOMER_NAME",

			resource: ResourceE.CUSTOMER,
			object: ObjectE.GENERAL,

			dataType: DataTypeE.TEXT,

			options: [],

			isSystem: true,
			isDeleted: false,

			createdBy: data.updatedBy as Types.ObjectId,
			updatedBy: data.updatedBy as Types.ObjectId,
		},

		// ORDER PROPERTIES
		{
			label: "RFP Number",
			propertyKey: "RFP_NUMBER",

			resource: ResourceE.ORDER,
			object: ObjectE.GENERAL,

			dataType: DataTypeE.TEXT,

			options: [],

			isSystem: true,
			isDeleted: false,

			createdBy: data.updatedBy as Types.ObjectId,
			updatedBy: data.updatedBy as Types.ObjectId,
		},
		{
			label: "RFP Date",
			propertyKey: "RFP_DATE",

			resource: ResourceE.ORDER,
			object: ObjectE.GENERAL,

			dataType: DataTypeE.DATE,

			options: [],

			isSystem: true,
			isDeleted: false,

			createdBy: data.updatedBy as Types.ObjectId,
			updatedBy: data.updatedBy as Types.ObjectId,
		},

		{
			label: "Customer PO Number",
			propertyKey: "CUSTOMER_PO_NUMBER",

			resource: ResourceE.ORDER,
			object: ObjectE.GENERAL,

			dataType: DataTypeE.TEXT,

			options: [],

			isSystem: true,
			isDeleted: false,

			createdBy: data.updatedBy as Types.ObjectId,
			updatedBy: data.updatedBy as Types.ObjectId,
		},
		{
			label: "Customer PO Date",
			propertyKey: "CUSTOMER_PO_DATE",

			resource: ResourceE.ORDER,
			object: ObjectE.GENERAL,

			dataType: DataTypeE.DATE,

			options: [],

			isSystem: true,
			isDeleted: false,

			createdBy: data.updatedBy as Types.ObjectId,
			updatedBy: data.updatedBy as Types.ObjectId,
		},
	];

	Promise.all(
		properties.map(
			async (property) => await propertyRepository.createProperty(property)
		)
	);
};
