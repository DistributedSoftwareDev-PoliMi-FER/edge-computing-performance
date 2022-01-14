import { Message } from '../model/Message';
import { AxiosActions } from '../utils/axios-implementations';
import { CHAT_SERVICE_URL } from '../utils/global-parameters';

// Saves the messages which couldn't have been sent to the master node (for backup purposes), and once in a whire retryes to send them (semi-transient errors)
export class UnsentMessagesList {
	private unsentMessages: Array<Message> = new Array<Message>();
	private axios: AxiosActions;


	// IntervalSeconds: How much time to wait before retying to send the message to the master node (in seconds)
	// axiosImplementation: object used to send http requests to other services. Can be mocked
	public constructor(intervalSeconds: number, axiosImplementation: AxiosActions) {
		this.axios = axiosImplementation;
		this.start(intervalSeconds * 1000);
	}

	// Adds a new message
	public add(message: Message) {
		this.unsentMessages.push(message);
	}

	// Starts sending the messages to the master node once every XXX seconds
	private start(interval: number) {
		if(interval > 0) {
			setInterval(() => {
				this.send(this); 
			}, interval);
		}
	}   

	// Sends the messages to the master node. If everything is ok the list is also cleared.
	public async send(self: UnsentMessagesList = this) {
		if(self.unsentMessages.length > 0) {
			try {
				console.log('trying to send unsent messages to the master node...');
				await self.axios.post(CHAT_SERVICE_URL, 200, self.unsentMessages);
			}
			catch (err) {
				console.error("unsent messages cannot be sent to the master node, I'll retry later\n\t" + err);
				return;
			}
			console.log('unsent messages correcty delivered to the master node!');
			self.unsentMessages.length = 0;
		}
	}

}