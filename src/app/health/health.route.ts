import express from "express";
import httpStatus from "http-status";

export default function defineHealthRoutes(expressApp: express.Application) {
	const healthRouter = express.Router();

	healthRouter.get("/", (_request, response) => {
		try {
			const healthCheck = {
				sucess: true,
				uptime: process.uptime(),
				responseTime: process.hrtime(),
				date: new Date(),
			};
			response.status(httpStatus.OK).send(healthCheck);
			return undefined;
		} catch (error) {
			response.status(httpStatus.SERVICE_UNAVAILABLE).send();
			return undefined;
		}
	});

	expressApp.use("/api/v1/health", healthRouter);
}
