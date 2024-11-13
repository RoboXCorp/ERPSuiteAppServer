import { Types } from "mongoose";

import Permission, { IPermission } from "./permission.model";

export const createPermission = async (data: Partial<IPermission>) => {
	return await Permission.create(data);
};

export const getAllWorkspacePermissions = async (
	workspaceRef: Types.ObjectId
) => {
	return await Permission.find({ workspaceRef, isDeleted: false })
		.select(["name", "createdBy", "updatedBy", "createdAt", "updatedAt"])
		.lean()
		.exec();
};

export const getPermissionById = async (_id: Types.ObjectId) => {
	return await Permission.findOne({ _id, isDeleted: false })
		.select(["name", "createdBy", "updatedBy", "createdAt", "updatedAt"])
		.lean()
		.exec();
};

export const updatePermission = async (
	_id: Types.ObjectId,
	data: Partial<IPermission>
) => {
	return await Permission.findOneAndUpdate({ _id, isDeleted: false }, data, {
		new: true,
	});
};
