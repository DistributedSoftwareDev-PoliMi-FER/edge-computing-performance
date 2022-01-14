
import * as mongoose from 'mongoose';
import { EdgeNode, IEdgeNode } from '../model/EdgeNode';
import { RestError, ErrorCode } from '../utils/errors';


export async function connectDb(connectionString: string) {
	//Const connectionString = "mongodb://localhost:27017/locator_service_test_db";
	//const connectionString = "mongodb://normalUser:HxogNnjbKzEC3g6iU8Gk@mongodsd.duckdns.org:27017/dsd?authSource=dsd&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=true";
	return await mongoose.connect(connectionString as string);
}


const edgeNodesSchema = new mongoose.Schema({
	_id: {
		type: String,
		reqired: true
	},
	publicIp: {
		type: String,
		required: true
	},
	country: {
		type: String,
		required: true
	},
	region: {
		type: String,
		required: true
	}
});


const edgeNode: mongoose.Model<IEdgeNode> = mongoose.model('EdgeNode', edgeNodesSchema);


export async function findNodesInCountry(country: string) {
	return edgeNode.find({ country: country }).lean();
}

export async function findNodesInRegion(region: string) {
	return edgeNode.find({ region: region }).lean();
}



export async function addNode(en: EdgeNode) {
	await edgeNode.create(en);
	return en;
}

export async function updateNode(en: EdgeNode) {
	const res = await edgeNode.updateOne({ _id: en._id }, { publicIp: en.publicIp, country: en.country, region: en.region });
	if(res.matchedCount === 0) {
		throw new RestError(`Cannot update edge node with id: ${en._id}, because it doesn't exist`, ErrorCode.ID_NOT_FOUND, 404);
	}
	return en;
}

export async function deleteNode(id: string) {
	const res = await edgeNode.findOneAndDelete({ _id: id }).lean();
	if(res == null) {
		throw new RestError(`Cannot delete edge node with id: ${id}, because it doesn't exist`, ErrorCode.ID_NOT_FOUND, 404);
	}
	return EdgeNode.createByInterface(res);
}