import { MongoMemoryServer } from 'mongodb-memory-server';

export async function connectionDB() {
	const mongod = await MongoMemoryServer.create();
	//Console.log(mongod);
	const uri = mongod.getUri();
	console.log(uri);
	return uri;
}
