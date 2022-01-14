module.exports = {
	apps: [
		{
			name: 'chat-test',
			script: './build/test.js',
			instances: 20, // this is the number of copies of the client in the pc
			exec_mode: 'cluster',
			watch: true,
			increment_var: 'NUMBER',
			env: {
				FIRST_CLIENT_NUM: 1, // not userd for now
				NUMBER: 1, // first number of the client in the pc
				INSTANCES: 20,
				MAX_CLIENTS: 30, // max clients connected for the test: all the clients connected to the architecture are considered
				MESSAGES_PER_SESSION: 50,

				NODE_ENV: 'development',
				EDGE_NODE_IP: '10.10.10.200',
				TESTING_EDGE: false
			},
		},
	],
};

// NB => the script considered that during a simulation the first client is always 1
