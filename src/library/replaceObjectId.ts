import { isValidObjectId } from "mongoose";

const replaceObjectId = (data: object | object[]): object | object[] => {
	if (Array.isArray(data)) {
		return data.map((value: any) => {
			if (
				typeof value === "object" &&
				value !== null &&
				!isValidObjectId(value)
			) {
				return replaceObjectId(value);
			}
			return value;
		});
	}

	return Object.keys(data as Object).reduce(
		(accum: any, value: string): any => {
			if (value === "_id") {
				return {
					...accum,
					id: data[value as keyof typeof data],
				};
			} else if (
				typeof data[value as keyof typeof data] === "object" &&
				data[value as keyof typeof data] !== null &&
				Number.isNaN(new Date(data[value as keyof typeof data]).getTime()) &&
				!isValidObjectId(data[value as keyof typeof data])
			) {
				return {
					...accum,
					[value]: replaceObjectId(data[value as keyof typeof data]),
				};
			}
			return {
				...accum,
				[value]: data[value as keyof typeof data],
			};
		},
		{}
	);
};

export default replaceObjectId;
