const Logger = {
	debug: (message: string, metadata: object = {}): void => {
		Object.keys(metadata).length
			? console.log(message, JSON.stringify(metadata))
			: console.log(message);
	},
	info: (message: string, metadata: object = {}): void => {
		Object.keys(metadata).length
			? console.log(message, JSON.stringify(metadata))
			: console.log(message);
	},
	warning: (message: string, metadata: object = {}): void => {
		Object.keys(metadata).length
			? console.log(message, JSON.stringify(metadata))
			: console.log(message);
	},
	error: (message: string, metadata: object = {}): void => {
		Object.keys(metadata).length
			? console.log(message, JSON.stringify(metadata))
			: console.log(message);
	},
};

export default Logger;
