export const IS_SERVICE_READY = true;
//Export const PROD_DB_CONNECTION_STRING = "mongodb://localhost:27017/locator_service_test_db";
export const TEST_DB_CONNECTION_STRING = 'mongodb://normalUser:HxogNnjbKzEC3g6iU8Gk@mongodsd.duckdns.org:27017/dsd?authSource=dsd&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=true';

const NODE_ENV: string = process.env.NODE_ENV as string;

export let PORT_NUMBER: string;
export let MINIMUM_NUMBER_OF_NODES_IN_REGION: number;
export let MINIMUM_NUMBER_OF_NODES_IN_COUNTRY: number;
export let NUMBER_OF_NEAREST_NODES: number;
export let PROD_DB_CONNECTION_STRING: string;
export const API_URL = 'https://edge-computing.polimi-ecb7249.gcp.mia-platform.eu';

if(NODE_ENV === 'production'){
	PORT_NUMBER = process.env.HTTP_PORT as string;
	MINIMUM_NUMBER_OF_NODES_IN_REGION = parseInt(process.env.MINIMUM_NUMBER_OF_NODES_IN_REGION as string);
	MINIMUM_NUMBER_OF_NODES_IN_COUNTRY = parseInt(process.env.MINIMUM_NUMBER_OF_NODES_IN_COUNTRY as string);
	NUMBER_OF_NEAREST_NODES = parseInt(process.env.NUMBER_OF_NEAREST_NODES as string);
	PROD_DB_CONNECTION_STRING = process.env.MONGODB_URL as string ;
}
else {
	PORT_NUMBER = '14009';
	MINIMUM_NUMBER_OF_NODES_IN_REGION = 2;
	MINIMUM_NUMBER_OF_NODES_IN_COUNTRY = 1;
	NUMBER_OF_NEAREST_NODES = 5;
	PROD_DB_CONNECTION_STRING = 'mongodb://normalUser:HxogNnjbKzEC3g6iU8Gk@mongodsd.duckdns.org:27017/dsd?authSource=dsd&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=true';
}
