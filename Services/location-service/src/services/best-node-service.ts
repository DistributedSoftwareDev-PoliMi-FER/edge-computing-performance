
import * as db from '../db/db-access';
import { EdgeNode } from '../model/EdgeNode';
import { ErrorCode, RestError } from '../utils/errors';
import { MINIMUM_NUMBER_OF_NODES_IN_COUNTRY, MINIMUM_NUMBER_OF_NODES_IN_REGION, NUMBER_OF_NEAREST_NODES } from '../utils/global-parameters';
import { getIpData, ipLocation } from '../utils/ip-localization-util';


//Extract from the database the nodes near the client
export async function getNearbyNodes(ipLocation: ipLocation) {
	const regionNodes = await db.findNodesInRegion(ipLocation.region);
	if(regionNodes.length < MINIMUM_NUMBER_OF_NODES_IN_REGION) {
		const countryNodes = await db.findNodesInCountry(ipLocation.country);
		if(regionNodes.length < MINIMUM_NUMBER_OF_NODES_IN_COUNTRY) {
			throw new RestError('Your location is too far away from any edge node', ErrorCode.NOT_ENOUGH_NODES, 422);
		}
		else {
			return countryNodes;
		}
	}
	else {
		return regionNodes;
	}
}


//Calulates the distance between two position (Haversine algorithm)
function distance(lat1: number, lon1: number, lat2: number, lon2: number){ 

	function toRad(x: number) {
		return x * Math.PI / 180;
	}
    
	const R = 6371; // Km 
	const x1: number = lat2 - lat1;
	const dLat: number = toRad(x1);  
	const x2: number = lon2 - lon1;
	const dLon: number = toRad(x2);  
	const a: number = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
                Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
                Math.sin(dLon / 2) * Math.sin(dLon / 2);  
	const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
	const d: number = R * c; 

	return d; // The result is in km and is float
}


//Returns the list of nearest nodes to the client
export async function nearestNodesToClient(clientIpLocation: ipLocation, nodes: EdgeNode[]) { 
   
interface DistanceIpNode {
distance: number;
node: EdgeNode;
}

//Find the distance between the client and each node in parallel. The result of Promise.all(arrayOfFunctions) is an array containing the result of the arrayOfFunctions
let listOfDistIpNode = await Promise.all(nodes.map(async currentNode => {
	const currentNodeInfo = getIpData(currentNode.publicIp); //Get info about the node

	//calculate client-node distance
	const distanceIpNode: DistanceIpNode = {
		distance: distance((await currentNodeInfo).lat, (await currentNodeInfo).lon, clientIpLocation.lat, clientIpLocation.lon),
		node: currentNode
	};
	return distanceIpNode;
}));

listOfDistIpNode = listOfDistIpNode.sort((a, b) => a.distance - b.distance).slice(0, NUMBER_OF_NEAREST_NODES); //Sort nodes based on distance from client, and keep only the top X
return listOfDistIpNode.map(x => x.node.publicIp); //Keeps only the IPs in one single array
}
