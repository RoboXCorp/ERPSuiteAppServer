import { Document, model, Model, Schema, PopulatedDoc, Types } from "mongoose";

import { IWorkspace } from "../workspace/workspace.model";
import { IUser } from "../user/user.model";

export enum ResourceE {
	WORKSPACE = "WORKSPACE",
	USER = "USER",
	PERMISSION = "PERMISSION",

	CUSTOMER = "CUSTOMER",
	ORDER = "ORDER",
}
export const RESOURCES = Object.values(ResourceE);

export enum ActionE {
	CREATE = "CREATE",
	READ = "READ",
	UPDATE = "UPDATE",
	DELETE = "DELETE",
}

export const ACTIONS = Object.values(ActionE);

export interface IAccess {
	resource: ResourceE;
	actions: ActionE[];
}

export interface IPermission {
	name: string;
	access: IAccess[];

	isDeleted: boolean;
	workspaceRef: PopulatedDoc<IWorkspace> | Types.ObjectId;

	createdBy: PopulatedDoc<IUser>;
	updatedBy: PopulatedDoc<IUser>;
}

export interface IPermissionDoc extends IPermission, Document {}

interface IPermissionModel extends Model<IPermissionDoc> {}

const permissionSchema = new Schema<IPermissionDoc, IPermissionModel>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},

		access: [
			{
				resource: {
					type: String,
					enum: RESOURCES,
					required: true,
					trim: true,
				},
				actions: [
					{
						type: String,
						enum: ACTIONS,
						required: true,
						trim: true,
					},
				],
			},
		],

		isDeleted: {
			type: Boolean,
			default: false,
		},
		workspaceRef: {
			type: Schema.Types.ObjectId,
			ref: "Workspace",
			required: true,
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

const Permission = model<IPermissionDoc, IPermissionModel>(
	"Permission",
	permissionSchema
);

export default Permission;
