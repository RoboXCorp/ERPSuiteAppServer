import { Document, model, Model, Schema, PopulatedDoc, Types } from "mongoose";

import { IWorkspace } from "../workspace/workspace.model";
import { IPermission } from "../permission/permission.model";

export interface IUser {
	name: string;
	email: string;
	passwordHash: string;

	isDeleted: boolean;

	workspaceRef: PopulatedDoc<IWorkspace> | Types.ObjectId;
	permission: PopulatedDoc<IPermission> | Types.ObjectId;

	createdBy: PopulatedDoc<IUser> | Types.ObjectId | null;
	updatedBy: PopulatedDoc<IUser> | Types.ObjectId | null;
}

export interface IUserDoc extends IUser, Document {}

interface IUserModel extends Model<IUserDoc> {}

const userSchema = new Schema<IUserDoc, IUserModel>(
	{
		name: {
			type: String,
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			trim: true,
			index: true,
		},
		passwordHash: {
			type: String,
		},

		isDeleted: {
			type: Boolean,
			default: false,
		},

		workspaceRef: {
			type: Schema.Types.ObjectId,
			ref: "Workspace",
		},
		permission: {
			type: Schema.Types.ObjectId,
			ref: "Permission",
		},

		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		updatedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
	},
	{
		versionKey: "_docVersion",
		timestamps: { currentTime: () => new Date() },
	}
);

const User = model<IUserDoc, IUserModel>("User", userSchema);

export default User;
