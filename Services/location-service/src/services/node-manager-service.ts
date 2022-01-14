
import * as db from '../db/db-access';
import { EdgeNode } from '../model/EdgeNode';


export async function addEdgeNode(edgeNode: EdgeNode) {
	return db.addNode(edgeNode);
}

export async function updateEdgeNode(edgeNode: EdgeNode) {
	return db.updateNode(edgeNode);
}

export async function deleteEdgeNode(id: string) {
	return db.deleteNode(id);
}
