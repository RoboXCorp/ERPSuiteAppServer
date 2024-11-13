import { Types } from "mongoose";

import Property, { IProperty } from "./property.model";

export const createProperty = async (data: Partial<IProperty>) => {
	return await Property.create(data);
};

export const getAllWorkspaceProperties = async (
	workspaceRef: Types.ObjectId
) => {
	return await Property.find({ workspaceRef, isDeleted: false }).lean().exec();
};

export const getPropertyById = async (_id: Types.ObjectId) => {
	return await Property.findOne({ _id, isDeleted: false }).lean().exec();
};

export const updateProperty = async (
	_id: Types.ObjectId,
	data: Partial<IProperty>
) => {
	return await Property.findOneAndUpdate({ _id, isDeleted: false }, data, {
		new: true,
	});
};
