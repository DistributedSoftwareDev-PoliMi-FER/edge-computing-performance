const swaggerAutogen = require('swagger-autogen')();

const outputFile = '../config/swagger-autogenerated.json';
const endpointsFiles = [
	'../routes/edge-nodes.js',
	'../routes/fake-auth.js',
	'../routes/probes.js',
	'../routes/stream.js',
];

swaggerAutogen(outputFile, endpointsFiles);