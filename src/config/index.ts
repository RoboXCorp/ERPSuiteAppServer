// Store configuration in a self-explanatory, strongly typed and hierarchical store
import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

if (process.env["NODE_ENV"] === "development") {
	dotenv.config({ path: path.join(__dirname, "../../.env") });
}

const environmentVariablesSchema = z.object({
	NODE_ENV: z.union([z.literal("production"), z.literal("development")]),
	PORT: z
		.string()
		.default("8080")
		.transform((str) => parseInt(str, 10)),

	DATABASE_URL: z.string().describe("mongo db url"),

	JWT_ACCESS_TOKEN_SECRET: z.string(),
	JWT_ACCESS_TOKEN_EXPIRY: z
		.string()
		.default("30")
		.transform((str) => parseInt(str, 10)),
});

const environmentVariables = environmentVariablesSchema.parse(process.env);

const config = {
	NODE_ENV: environmentVariables.NODE_ENV,
	PORT: environmentVariables.PORT,

	DATABASE_URL: environmentVariables.DATABASE_URL,

	JWT_ACCESS_TOKEN_SECRET: environmentVariables.JWT_ACCESS_TOKEN_SECRET,
	JWT_ACCESS_TOKEN_EXPIRY: environmentVariables.JWT_ACCESS_TOKEN_EXPIRY,
};

export default config;
