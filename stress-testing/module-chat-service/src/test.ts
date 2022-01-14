import { exit } from 'process';
import { TestWebSocketClient } from './testing-mode/testClientWs';
import { encryptString } from './utils/crypto';

//const userIdInt = parseInt(process.env.NUM_USER_ID as string);
const messagesPerSession = parseInt(process.env.MESSAGES_PER_SESSION as string);
const numClients = parseInt(process.env.MAX_CLIENTS as string);
const machineNumber = parseInt(process.env.NUMBER as string);
const firstClient = parseInt(process.env.FIRST_CLIENT_NUM as string);
const instances = parseInt(process.env.INSTANCES as string);
const username = ('machine-' + process.env.NUMBER) as string;
const testing = process.env.TESTING_EDGE as string;
const clientTarget = new Map();

// create the map of the targets
createClientTarget(
	parseInt(process.env.NUMBER as string),
	clientTarget,
	numClients
);

function createClientTarget(
	userIdInt: number,
	clientTarget: Map<number, string>,
	numClients: number
) {
	for (var i = 1; i <= numClients; i++) {
		if (i !== userIdInt) {
			clientTarget.set(i, 'machine-' + i);
		}
	}
	console.log('the target are: ');
	console.log(clientTarget);
}

let sentMessages = 0;
let receivedMessages = 0;

const setUpListeners = (client: TestWebSocketClient) => {
	// Connection established
	client.getSocket().on('connection_report', (res) => {
		console.log(`SCTE: ${process.env.EDGE_NODE_IP}`);
		return;
	});

	// Message received
	client.getSocket().on('chat_message', (data: any) => {
		// `${sentMessages}-${machineNumber}`
		let msg = data.message.split('-');
		let sender = parseInt(msg[1] as string);
		console.log(`${MRF(sender)} Number ${msg[0]} from ${sender}`);
		receivedMessages++;
	});
};

const Start = async () => {
	console.log(`Direct connection to: ${process.env.EDGE_NODE_IP}`);
	//create the clients
	let uri = '';
	if(testing === 'true'){
		uri = `http://${process.env.EDGE_NODE_IP}:8080/`;
	}else{
		uri = 'https://edge-computing.polimi-ecb7249.gcp.mia-platform.eu/';
	}
	const thisClient = new TestWebSocketClient(
		`http://${process.env.EDGE_NODE_IP}:8080/`,
		username,
		false
	);

	setUpListeners(thisClient);

	// Set a delay for each machine
	await new Promise((resolve) => setTimeout(resolve, 5000));

	//start sending messages
	const sendMsgInterval = setInterval(() => {
		if (sentMessages == messagesPerSession) {
			console.log(`AMS from Machine ${machineNumber}`);
			clearInterval(sendMsgInterval);
		}

		let nextUser = selectNext();

		let message = {
			receiverId: encryptString(clientTarget.get(nextUser)),
			message: `${sentMessages}-${machineNumber}`,
		};

		thisClient.getSocket().emit('post', message);

		console.log(`${MST(nextUser)} Number ${sentMessages} to ${nextUser}`);

		sentMessages++;
	}, 5000);
};

const MST = (number: Number) => {
	return isInternal(number) ? 'MSTI' : 'MSTE';
};

const MRF = (number: Number) => {
	return isInternal(number) ? 'MRFI' : 'MRFE';
};

const isInternal = (mNumber: Number) => {
	return firstClient <= mNumber && mNumber < firstClient + instances;
};

const selectNext = () => {
	let selected = 0;
	do {
		selected = Math.floor(Math.random() * numClients) + 1;
	} while (selected == machineNumber);
	return selected;
};

Start();

/*
1) SCTE: {ip_edgenode} Successfully connected to edge node
2) MSTI Number {msg_number} to {machine_number} Message Sent To Internal client
3) MSTE Number {msg_number} to {machine_number} Message Sent To External client
4) MRFI Number {msg_number} from {machine_number} Message Received From Internal client
5) MRFE Number {msg_number} from {machine_number} Message Received From External client
6) AMS from Machine {machine_number} All Messages Sent from Machine 
*/
