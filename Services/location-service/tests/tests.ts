import * as chai from 'chai';
import * as express from 'express';
import chaiHttp = require('chai-http');
import * as nodesManager from '../src/location-service';
import { PORT_NUMBER, TEST_DB_CONNECTION_STRING } from '../src/utils/global-parameters';
import { connectDb } from '../src/db/db-access';
import * as mongoose from 'mongoose';

chai.use(chaiHttp);

const app = express();
let db: mongoose.Mongoose;

describe('service', function(){

	before(async function() {
		const port = PORT_NUMBER;
		db = await connectDb(TEST_DB_CONNECTION_STRING);
		nodesManager.start(app, port);
	});

	it('should return posted node', function(){
		return chai.request(app)
			.post('/')
			.set('content-type', 'application/json')
			.set('x-forwarded-for', '198.55.220.210')
			.send({ id: 'SERVICETEST1' })
			.then(function(res){
				chai.expect(res).to.have.status(201);
				chai.expect(res).to.be.json;
				chai.expect(res.body._id).to.equal('SERVICETEST1');
				chai.expect(res.body.publicIp).to.equal('198.55.220.210');
				chai.expect(res.body.country).to.be.a('string');
				chai.expect(res.body.region).to.be.a('string');
			});
	}); 

	it('should return error (insertion)', function(){
		return chai.request(app)
			.post('/')
			.set('content-type', 'application/json')
			.set('x-forwarded-for', '198.55.220.215')
			.send({ id: 'SERVICETEST1' })
			.then(function(res){
				chai.expect(res).to.have.status(500);
				chai.expect(res).to.be.json;
				chai.expect(res.body.statusCode).to.equal(500);
				chai.expect(res.body.code).to.equal(0);
				chai.expect(res.body.message).to.be.a('string');
			});
	}); 

	it('should return nearby nodes', function(){
		return chai.request(app)
			.get('/')
			.set('content-type', 'application/json')
			.set('x-forwarded-for', '198.55.220.211')
			.then(function(res){
				chai.expect(res).to.have.status(200);
				chai.expect(res).to.be.json;
				chai.expect(res.body).to.be.a('array');
			});
	}); 

	it('should return error (no nearby nodes)', function(){
		return chai.request(app)
			.get('/')
			.set('content-type', 'application/json')
			.set('x-forwarded-for', '192.50.123.15')
			.then(function(res){
				chai.expect(res).to.have.status(422);
				chai.expect(res).to.be.json;
				chai.expect(res.body.statusCode).to.equal(422);
				chai.expect(res.body.code).to.equal(4);
				chai.expect(res.body.message).to.be.a('string');
			});
	}); 

	it('should return error (get)', function(){
		return chai.request(app)
			.get('/')
			.set('content-type', 'application/json')
			.then(function(res){
				chai.expect(res).to.have.status(500);
				chai.expect(res).to.be.json;
				chai.expect(res.body.statusCode).to.equal(500);
				chai.expect(res.body.code).to.equal(6);
				chai.expect(res.body.message).to.be.a('string');
			});
	}); 

	it('should modify the edge node', function(){
		return chai.request(app)
			.put('/')
			.set('content-type', 'application/json')
			.set('x-forwarded-for', '198.55.220.212')
			.send({ id: 'SERVICETEST1' })
			.then(function(res){
				chai.expect(res).to.have.status(201);
				chai.expect(res).to.be.json;
				chai.expect(res.body._id).to.equal('SERVICETEST1');
				chai.expect(res.body.publicIp).to.equal('198.55.220.212');
				chai.expect(res.body.country).to.be.a('string');
				chai.expect(res.body.region).to.be.a('string');
			});
	}); 

	it('should return error (modification)', function(){
		return chai.request(app)
			.put('/')
			.set('content-type', 'application/json')
			.set('x-forwarded-for', '198.55.220.212')
			.send({ id: 'SERVICETEST2' })
			.then(function(res){
				chai.expect(res).to.have.status(404);
				chai.expect(res).to.be.json;
				chai.expect(res.body.statusCode).to.equal(404);
				chai.expect(res.body.code).to.equal(2);
				chai.expect(res.body.message).to.be.a('string');
			});
	}); 

	it('should delete the edge node', function(){
		return chai.request(app)
			.delete('/')
			.set('content-type', 'application/json')
			.send({
				id: 'SERVICETEST1'
			})
			.then(function(res){
				chai.expect(res).to.have.status(200);
				chai.expect(res).to.be.json;
				chai.expect(res.body._id).to.equal('SERVICETEST1');
				chai.expect(res.body.publicIp).to.equal('198.55.220.212');
				chai.expect(res.body.country).to.be.a('string');
				chai.expect(res.body.region).to.be.a('string');
			});
	}); 

	it('should return error (deletion)', function(){
		return chai.request(app)
			.delete('/')
			.set('content-type', 'application/json')
			.send({
				id: 'SERVICETEST1'
			})
			.then(function(res){
				chai.expect(res).to.have.status(404);
				chai.expect(res).to.be.json;
				chai.expect(res.body.statusCode).to.equal(404);
				chai.expect(res.body.code).to.equal(2);
				chai.expect(res.body.message).to.be.a('string');
			});
	}); 

	after(function(){
		nodesManager.shutDown();
		db.connection.db.dropDatabase();
	});

});