import mongoose from "mongoose";

import config from "../config";

export default async () => {
	const connection = await mongoose.connect(config.DATABASE_URL, {
		autoCreate: true,
	});
	return connection;
};
