import { initializeMongoDb } from './mongoDbConnector';

export default async callback => {
	// connect to a database if needed, then pass it to `callback`:
	await initializeMongoDb()
	callback();
}
