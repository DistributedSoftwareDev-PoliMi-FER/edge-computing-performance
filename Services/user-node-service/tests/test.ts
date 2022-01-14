import * as chai from 'chai';
import * as express from 'express';
import * as nodeUserManager from '../src/node-user-manager';
import { connectionDB } from './db/mock-db';
import chaiHttp = require('chai-http');

const app = express();
const port = process.env.HTTP_PORT;

chai.use(chaiHttp);

describe('Endpoint tests', () => {
		
	before(async function() {
		const uri = await connectionDB();
		nodeUserManager.start(app, port, uri);
	});

	// First POST test
	it(('Check first POST'), async() => {
		return await chai.request(app)
			.post('/')
			.set('content-type', 'application/json')
			.set('X-Forwarded-For', '127.0.0.1')
			.send({
				idUser: 'stefano'
			})
			.then(res => {
				chai.expect(res).to.have.status(201);
				chai.expect(res).to.be.json;
				chai.expect(res.body.idUser).to.equal('stefano');
				chai.expect(res.body.ipEdgenode).to.equal('127.0.0.1');
			});
        
	});

	// Second POST test
	it('Check second POST', async() => {
		return await chai.request(app)
			.post('/')
			.set('content-type', 'application/json')
			.set('X-Forwarded-For', '172.0.1.43')
			.send({
				idUser: 'lapo'
			})
			.then(res => {
				chai.expect(res).to.have.status(201);
				chai.expect(res).to.be.json;
				chai.expect(res.body.idUser).to.equal('lapo');
				chai.expect(res.body.ipEdgenode).to.equal('172.0.1.43');
			});
	});
    
	// Third POST test 
	// In this case the post should modify the resource since this ip is already registered
	it('Check third POST (IN THIS, TEST SHOULD WORKS LIKE AN UPDATE))', async() => {
		return await chai.request(app)
			.post('/')
			.set('content-type', 'application/json')
			.set('X-Forwarded-For', '172.0.1.43')
			.send({
				idUser: 'stefano'
			})
			.then(res => {
				chai.expect(res).to.have.status(201);
				chai.expect(res).to.be.json;
				chai.expect(res.body.idUser).to.equal('stefano');
				chai.expect(res.body.ipEdgenode).to.equal('172.0.1.43');
			});
        
	});

	// Fourth POST test with error, 
	// BAD REQUEST ERROR
	it('Check fourth POST with error (BAD REQUEST ERROR)', async() => {
		return await chai.request(app)
			.post('/')
			.set('content-type', 'application/json')
			.set('X-Forwarded-For', '172.0.1.43')
			.send({
			})
			.then(res => {
				chai.expect(res).to.have.status(400);
				chai.expect(res).to.be.json;
				chai.expect(res.body.message).to.be.a('string');
				chai.expect(res.body.code).to.equal(2);
			});
        
	});

	// First GET test
	it('Check first GET', async() => {
		return await chai.request(app)
			.get('/stefano')
			.then(res => {
				chai.expect(res).to.have.status(200);
				chai.expect(res).to.be.json;
				chai.expect(res.body[0].idUser).to.equal('stefano');
				chai.expect(res.body[0].ipEdgenode).to.equal('172.0.1.43');
			});
        
	});

	// First UPDATE/PUT test
	it('Check first UPDATE/PUT', async() => {
		return await chai.request(app)
			.put('/')
			.set('content-type', 'application/json')
			.set('X-Forwarded-For', '172.0.1.43')
			.send({
				idUser: 'stefano'
			})
			.then(res => {
				chai.expect(res).to.have.status(201);
			});
        
	});

	// Second UPDATE/PUT test with error
	// ERROR CODE = 1 
	// User does not exist
	it('Check second UPDATE/PUT with error', async() => {
		return await chai.request(app)
			.put('/')
			.set('content-type', 'application/json')
			.set('X-Forwarded-For', '172.0.1.43')
			.send({
				idUser: 'matteo',
			})
			.then(res => {
				chai.expect(res).to.have.status(404);
				chai.expect(res).to.be.json;
				chai.expect(res.body.message).to.be.a('string');
				chai.expect(res.body.code).to.equal(1);
			});
        
	});

	// First DELETE test
	it('Check first DELETE', async() => {
		return await chai.request(app)
			.delete('/user/')
			.set('content-type', 'application/json')
			.send({
				idUser: 'stefano'
			})
			.then(res => {
				chai.expect(res).to.have.status(200);
			});
       
	});

	// Second GET test with error
	it('Check second GET with error', async() => {
		return await chai.request(app)
			.get('/stefano')
			.then(res => {
				chai.expect(res).to.have.status(404);
				chai.expect(res).to.be.json;
				chai.expect(res.body.message).to.be.a('string');
				chai.expect(res.body.code).to.equal(1);
			});
        
	});

	// Fifth POST test
	it('Check fifth POST', async() => {
		return await chai.request(app)
			.post('/')
			.set('content-type', 'application/json')
			.set('X-Forwarded-For', '172.0.1.43')
			.send({
				idUser: 'stefano'
			})
			.then(res => {
				chai.expect(res).to.have.status(201);
				chai.expect(res).to.be.json;
				chai.expect(res.body.idUser).to.equal('stefano');
				chai.expect(res.body.ipEdgenode).to.equal('172.0.1.43');
			});
	});

	// First DELETE test by node
	it('Check first DELETE by node', async() => {
		return await chai.request(app)
			.delete('/node')
			.set('content-type', 'application/json')
			.set('X-Forwarded-For', '172.0.1.43')
			.send({
			})
			.then(res => {
				chai.expect(res).to.have.status(200);
			});
        
	});

	// Second DELETE test by node
	it('Check second DELETE by node with error', async() => {
		return await chai.request(app)
			.delete('/node')
			.set('content-type', 'application/json')
			.set('X-Forwarded-For', '180.0.1.3')
			.send({
			})
			.then(res => {
				chai.expect(res).to.have.status(404);
				chai.expect(res).to.be.json;
				chai.expect(res.body.message).to.be.a('string');
				chai.expect(res.body.code).to.equal(1);
			});
        
	});

	// Third DELETE test by node
	it('Check third DELETE by node with error (BAD REQUEST ERROR)', async() => {
		return await chai.request(app)
			.delete('/node')
			.set('content-type', 'application/json')
			.send({
				idUser: 'stefano'
			})
			.then(res => {
				chai.expect(res).to.have.status(404);
				chai.expect(res).to.be.json;
				chai.expect(res.body.message).to.be.a('string');
				chai.expect(res.body.code).to.equal(1);
			});
        
	});

	// Third GET test with error
	it('Check third GET with error', async() => {
		return await chai.request(app)
			.get('/stefano')
			.then(res => {
				chai.expect(res).to.have.status(404);
				chai.expect(res).to.be.json;
				chai.expect(res.body.message).to.be.a('string');
				chai.expect(res.body.code).to.equal(1);
			});
	});

	

	// Third UPDATE/PUT test with error
	it('Check third UPDATE/PUT with error (BAD REQUEST ERROR)', async() => {
		return await chai.request(app)
			.put('/')
			.set('content-type', 'application/json')
			.send({
				idUser: 'matteo'
			})
			.then(res => {
				chai.expect(res).to.have.status(404);
				chai.expect(res).to.be.json;
				chai.expect(res.body.message).to.be.a('string');
				chai.expect(res.body.code).to.equal(1);
			});
        
	});
});