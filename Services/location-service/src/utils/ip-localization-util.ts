import * as http from 'http';
import { ErrorCode, RestError } from './errors';

// Type for geolocalization info about one ip address
export interface ipLocation {
    ip: string;
    country: string;
    region: string;
    lat: number;
    lon: number;    
}



// This function take the information of an IP from http://ip-api.com
function ipInfo(ipAddress: string){  
	const url = 'http://ip-api.com/json/' + ipAddress;

	return new Promise(resolve => {
		http.request(url, (res: http.IncomingMessage) => {
			let message = '';

			res.on('error', () => {
				throw new RestError('External API to get IP location information failed', ErrorCode.EXTERNAL_LOCATION_API_ERROR, 500);
			});

			res.on('data', (newData: string) => {
				message += newData;
			});

			res.on('end', () => {
				resolve(message);
			});
		}).end();
	});
}


// This function returns the data of country and region from an IP address
export async function getIpData(addressIP: string){  
	const addressInfoJSON = await ipInfo(addressIP) as string;
	const addressInfo = JSON.parse(addressInfoJSON);

	if(addressInfo.status === 'fail') {
		throw new RestError('External API to get IP location information failed!', ErrorCode.EXTERNAL_LOCATION_API_ERROR, 500);
	}

	const  info: ipLocation = {
		ip: addressInfo.query,
		country: addressInfo.country,
		region: addressInfo.regionName,
		lat: addressInfo.lat,
		lon: addressInfo.lon
	};

	return info;
}