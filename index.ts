import startApplicationServer from "./src/server";

import Logger from "./src/library/logger";

async function start() {
	// 🦉 Array of entry point is being used to support more entry-points kinds like message queue, scheduled job,
	return Promise.all([startApplicationServer()]);
}

start()
	.then(([applicationResponse]) => {
		Logger.info(
			`The app has started successfully at http://localhost:${applicationResponse.port}`
		);
	})
	.catch((error) => {
		console.log(error);
		Logger.error("unable to start the server at the moment ->", error);
	});
