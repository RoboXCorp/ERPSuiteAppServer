import { Document, model, Model, Schema, PopulatedDoc, Types } from "mongoose";

import { IUser } from "../user/user.model";
import { ResourceE, RESOURCES } from "../permission/permission.model";

export interface IPropertyValue {
	value: string;
	type: DataTypeE;
}

export enum DataTypeE {
	TEXT = "TEXT",
	NUMBER = "NUMBER",

	DROPDOWN_SELECT = "DROPDOWN_SELECT",

	DATE = "DATE",
}
const DATATYPES = Object.values(DataTypeE);

export enum ObjectE {
	GENERAL = "GENERAL",
	ITEMS = "ITEMS", // This applicable for order items
}

const OBJECTS = Object.values(ObjectE);

export interface IProperty {
	label: string;
	propertyKey: string;

	resource: ResourceE;
	dataType: DataTypeE;
	object: ObjectE;

	options: string[];

	isSystem: boolean;
	isDeleted: boolean;

	createdBy: PopulatedDoc<IUser> | Types.ObjectId;
	updatedBy: PopulatedDoc<IUser> | Types.ObjectId;
}

interface IPropertyDoc extends IProperty, Document {}

interface IPropertyModel extends Model<IPropertyDoc> {}

const propertySchema = new Schema<IPropertyDoc, IPropertyModel>(
	{
		propertyKey: {
			type: String,
			unique: true,
			trim: true,
			index: true,
		},

		label: {
			type: String,
			required: true,
			trim: true,
		},
		resource: {
			type: String,
			enum: RESOURCES,
			required: true,
			trim: true,
		},
		dataType: {
			type: String,
			enum: DATATYPES,
			required: true,
			trim: true,
		},
		object: {
			type: String,
			enum: OBJECTS,
			required: true,
			trim: true,
		},
		options: [
			{
				type: String,
				trim: true,
				required: true,
			},
		],

		isSystem: {
			type: Boolean,
			default: true,
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

const Property = model<IPropertyDoc, IPropertyModel>(
	"Property",
	propertySchema
);

export default Property;
