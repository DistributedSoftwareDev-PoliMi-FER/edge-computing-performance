import { main } from './chat-service';
import * as express from 'express';
import { AxiosMockActions, AxiosRealActions } from './utils/axios-implementations';
import { MockedChatService, MockedUserNodeService } from './utils/mocked-services';
import { NODE_ENV, PORT_NUMBER } from './utils/global-parameters';

if(NODE_ENV === 'production' || NODE_ENV === 'testing') {
	const app = express();
	const axios = new AxiosRealActions();
	main(app, axios, PORT_NUMBER);
}

else {
	const mockedChatService = new MockedChatService();
	const mockedUserNodeService = new MockedUserNodeService();

	const app1 = express();
	const axios1 = new AxiosMockActions('ip1', mockedUserNodeService, mockedChatService);
	const app2 = express();
	const axios2 = new AxiosMockActions('ip2', mockedUserNodeService, mockedChatService);

	main(app1, axios1, '14001');
	main(app2, axios2, '14002');
}