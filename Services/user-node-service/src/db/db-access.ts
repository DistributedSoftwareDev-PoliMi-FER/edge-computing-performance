import * as mongoose from 'mongoose';
import {UserEdgeNode, UserEdgeNodeInterface} from '../model/model';
import { RestError, ErrorCode } from '../utils/errors';

export function connectionDB(dbAddress: string){
	mongoose.connect(dbAddress).catch(error => console.log(error));
	// Console.log("connection");   //debug
}

const userEdgeNodeSchema = new mongoose.Schema({
	idUser: {
		type: String,
		required: true
	},
	ipEdgenode: {
		type: String,
		required: true
	},
});

const userEdgeNode: mongoose.Model<UserEdgeNodeInterface> = mongoose.model('UserEdgeNode', userEdgeNodeSchema);

export async function findUserInfo(userId: string){
	try {
		const exist = await userEdgeNode.exists({idUser: userId});
		if(exist === false){
			throw new RestError(ErrorCode.ID_NOT_FOUND, `Cannot find user with id: ${userId}, because it doesn't exist`, 404);
		}
		else {
			const res = await userEdgeNode.find({idUser: userId}).lean();
			return res;
		}
	}
	catch (err) {
		if(err instanceof RestError) {
			throw err;
		}
		else {
			throw new RestError(ErrorCode.UNKNOWN_DB_ERROR, (err as Error).message);
		}
	}
}

export async function addUserNode(uen:UserEdgeNode) {
	try {
		const exist = await userEdgeNode.exists({idUser: uen.idUser});
		if(exist === false){
			await userEdgeNode.create(uen);
		}
		else {
			const res = await userEdgeNode.updateOne({idUser: uen.idUser}, {ipEdgenode: uen.ipEdgenode}).lean();
		}
	}
	catch (err){
		if(err instanceof RestError) {
			throw err;
		}
		else {
			throw new RestError(ErrorCode.UNKNOWN_DB_ERROR, (err as Error).message);
		}
	}
	return uen;
}

export async function updateUserNode(uen: UserEdgeNode){
	try {
		const res = await userEdgeNode.updateOne({idUser: uen.idUser}, {ipEdgenode: uen.ipEdgenode}).lean();
		if(res.matchedCount === 0){
			throw new RestError(ErrorCode.ID_NOT_FOUND, `Cannot update user with id: ${uen.idUser}, because it doesn't exist`, 404);
		}
		return uen;
	}
	catch (err){
		if(err instanceof RestError) {
			throw err;
		}
		else {
			throw new RestError(ErrorCode.UNKNOWN_DB_ERROR, (err as Error).message);
		}
	}
}

export async function deleteUserID(userId: string){
	try {
		const res = await userEdgeNode.findOneAndDelete({idUser: userId}).lean();
		if(res == null) {
			throw new RestError(ErrorCode.ID_NOT_FOUND, `Cannot delete user with id: ${userId}, because it doesn't exist`, 404);
		}
		return UserEdgeNode.createByUserId(res.idUser, res.ipEdgenode);
	}
	catch (err){
		if(err instanceof RestError) {
			throw err;
		}
		else {
			throw new RestError(ErrorCode.UNKNOWN_DB_ERROR, (err as Error).message);
		}
	}
}

export async function delUserEdgeNode(userId: string, ipEdgenode: string) {
	try {
		const res = await userEdgeNode.findOneAndDelete({idUser: userId, ipEdgenode: ipEdgenode}).lean();
		if(res == null) {
			throw new RestError(ErrorCode.ID_NOT_FOUND, `Cannot delete user with id: ${userId} and edgenode with ip: ${ipEdgenode}, because it doesn't exist`, 404);
		}
		return UserEdgeNode.createByUserId(res.idUser, res.ipEdgenode);
	}
	catch (err){
		if(err instanceof RestError) {
			throw err;
		}
		else {
			throw new RestError(ErrorCode.UNKNOWN_DB_ERROR, (err as Error).message);
		}
	}
}

export async function deleteEdgeNodeID(edgenodeId: string) {
	try {
		const res = await userEdgeNode.find({ipEdgenode: edgenodeId}).lean();
		const del = await userEdgeNode.deleteMany({ipEdgenode: edgenodeId});
		if(del.deletedCount === 0) {
			throw new RestError(ErrorCode.ID_NOT_FOUND, `Cannot delete edgenodes with id: ${edgenodeId}, because they don't exist`, 404);
		}
		return res;
	}
	catch (err){
		if(err instanceof RestError) {
			throw err;
		}
		else {
			throw new RestError(ErrorCode.UNKNOWN_DB_ERROR, (err as Error).message);
		}
	}
}

