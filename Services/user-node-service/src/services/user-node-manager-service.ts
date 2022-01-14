import * as db from '../db/db-access';
import { UserEdgeNode } from '../model/model';

export async function addUserEdgeNode(userEdgeNode: UserEdgeNode) {
	return db.addUserNode(userEdgeNode);
}

export async function updateUserEdgeNode(userEdgeNode: UserEdgeNode) {
	return db.updateUserNode(userEdgeNode);
}

export async function delUserEdgeNode(idUser: string) {
	return db.deleteUserID(idUser);
}

export async function delByUserAndEdgeNode(idUser: string, ipEdgenode: string) {
	return db.delUserEdgeNode(idUser, ipEdgenode);
}

export async function delEdgeNode(idEdgenode: string) {
	return db.deleteEdgeNodeID(idEdgenode);
}