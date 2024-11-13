import { Document, model, Model, Schema, PopulatedDoc } from "mongoose";

import { IWorkspace } from "../workspace/workspace.model";
import { IUser } from "../user/user.model";
import { IPropertyValue } from "../property/property.model";

export interface ICustomer {
	properties: Record<string, IPropertyValue>;

	isDeleted: boolean;
	workspaceRef: PopulatedDoc<IWorkspace>;

	createdBy: PopulatedDoc<IUser>;
	updatedBy: PopulatedDoc<IUser>;
}

export interface ICustomerDoc extends ICustomer, Document {}

export interface ICustomerModel extends Model<ICustomerDoc> {}

const customerSchema = new Schema<ICustomerDoc, ICustomerModel>(
	{
		properties: {
			type: Object,
			required: true,
		},

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

const customer = model<ICustomerDoc, ICustomerModel>(
	"Customer",
	customerSchema
);

export default customer;
