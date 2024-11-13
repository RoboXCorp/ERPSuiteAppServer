import { Types } from "mongoose";

import Workspace, { IWorkspace } from "./workspace.model";

export const createWorkspace = async (workspace: Partial<IWorkspace>) => {
	return await Workspace.create(workspace);
};

export const getWorkspaceById = async (_id: Types.ObjectId) => {
	return await Workspace.findOne({ _id, isDeleted: false }).lean().exec();
};

export const getWorkspaceByHandle = async (handle: string) => {
	return await Workspace.findOne({ handle, isDeleted: false }).lean().exec();
};
