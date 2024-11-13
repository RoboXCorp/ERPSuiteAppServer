import { Document, model, Model, Schema, PopulatedDoc, Types } from "mongoose";

import { IUser } from "../user/user.model";

export interface IWorkspace {
	name: string;
	handle: string;

	isDeleted: boolean;

	createdBy: PopulatedDoc<IUser> | Types.ObjectId;
	updatedBy: PopulatedDoc<IUser> | Types.ObjectId;
}

export interface IWorkspaceDoc extends IWorkspace, Document {}

interface IWorkspaceModel extends Model<IWorkspaceDoc> {}

const WorkspaceSchema = new Schema<IWorkspaceDoc, IWorkspaceModel>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		handle: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},

		isDeleted: {
			type: Boolean,
			default: false,
		},

		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		updatedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{
		versionKey: "_docVersion",
		timestamps: { currentTime: () => new Date() },
	}
);

const Workspace = model<IWorkspaceDoc, IWorkspaceModel>(
	"Workspace",
	WorkspaceSchema
);

export default Workspace;
