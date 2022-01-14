const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');
const validator = require('validator').default;

const Schema = mongoose.Schema;

const streamSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	thumbnail: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	streamkey: {
		type: String,
		required: false,
	},
	type: {
		type: String,
		enum: ['PUBLIC', 'PRIVATE'],
		default: 'PUBLIC',
	},
	invited: {
		type: [String],
		default: [],
	},
	status: {
		type: String,
		enum: ['ONLINE', 'OFFLINE'],
		default: 'OFFLINE',
	},
	author: {
		type: String,
		required: true,
	},
});

streamSchema.methods.generateStreamKey = function() {
	// Const streamkey = CryptoJS.AES.encrypt(
	// 	this._id.toString(),
	// 	process.env.STREAMKEY_SECRET
	// );
	const streamkey = CryptoJS.HmacSHA1(
		this._id.toString(),
		process.env.STREAMKEY_SECRET
	);

	const escapedStreamkey = validator.escape(streamkey.toString());

	this.streamkey = escapedStreamkey;
	return this.save();
};

module.exports = mongoose.model('Stream', streamSchema);
