import { Types } from "mongoose";
import httpStatus from "http-status";

import replaceObjectId from "../../library/replaceObjectId";
import AppError, { ErrorTypeE } from "../../library/exception";

import * as customerRepository from "./customer.repository";
import { ICustomer } from "./customer.model";

export const getAllcustomer = async (workspaceId: Types.ObjectId) => {
	const customer = await customerRepository.getAllWorkspacecustomer(
		workspaceId
	);
	return replaceObjectId(customer) as ICustomer[];
};
export const getCustomer = async (id: Types.ObjectId) => {
	const customer = await customerRepository.getCustomerById(id);

	if (!customer) {
		throw new AppError(
			ErrorTypeE.VALIDATION_ERROR,
			"Invalid Branch ID",
			httpStatus.BAD_REQUEST
		);
	}
	return replaceObjectId(customer);
};

export const createCustomer = async (data: Partial<ICustomer>) => {
	const customer = await customerRepository.createCustomer(data);

	return replaceObjectId(customer);
};

export const updateCustomer = async (
	id: Types.ObjectId,
	data: Partial<ICustomer>
) => {
	const customer = await customerRepository.updateCustomer(id, data);

	if (!customer) {
		throw new AppError(
			ErrorTypeE.VALIDATION_ERROR,
			"Invalid Product ID",
			httpStatus.BAD_REQUEST
		);
	}

	return replaceObjectId(customer);
};

export const deletecustomer = async (id: Types.ObjectId) => {
	const customer = await customerRepository.updateCustomer(id, {
		isDeleted: true,
	});

	if (!customer) {
		throw new AppError(
			ErrorTypeE.VALIDATION_ERROR,
			"Invalid Product ID",
			httpStatus.BAD_REQUEST
		);
	}

	return replaceObjectId(customer);
};
