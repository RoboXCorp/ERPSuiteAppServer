import { Types } from "mongoose";

import Customer, { ICustomer } from "./customer.model";

export const getAllWorkspacecustomer = async (workspaceRef: Types.ObjectId) =>
	await Customer.find({ workspaceRef, isDeleted: false }).lean().exec();

export const getCustomerById = async (_id: Types.ObjectId) =>
	await Customer.findOne({ _id, isDeleted: false }).lean().exec();

export const createCustomer = async (data: Partial<ICustomer>) =>
	await Customer.create(data);

export const updateCustomer = async (
	_id: Types.ObjectId,
	data: Partial<ICustomer>
) => await Customer.findOneAndUpdate({ _id, isDeleted: false }, data);
