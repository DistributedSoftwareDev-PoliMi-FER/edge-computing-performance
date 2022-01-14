const { MongoMemoryServer } = require('mongodb-memory-server');

async function connectionDB() {
	const mongod = await MongoMemoryServer.create();
	//Console.log(mongod);
	const uri = mongod.getUri();
	console.log(uri);
	return uri;
}

module.exports = connectionDB;
