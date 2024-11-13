import { Types } from "mongoose";

import User, { IUser } from "./user.model";

export const createUser = async (user: Partial<IUser>) => {
	return await User.create(user);
};

export const getUserById = async (_id: Types.ObjectId) => {
	return await User.findOne({ _id, isDeleted: false }).lean().exec();
};

export const getUserByEmail = async (email: string) => {
	return await User.findOne({ email, isDeleted: false }).lean().exec();
};

export const getAllWorkspaceUsers = async (workspaceRef: Types.ObjectId) => {
	return await User.find({ workspaceRef, isDeleted: false }).lean().exec();
};

export const updateUser = async (_id: Types.ObjectId, user: Partial<IUser>) => {
	return await User.findOneAndUpdate({ _id, isDeleted: false }, user, {
		new: true,
	});
};
