const CryptoJS = require('crypto-js');

module.exports = (req, res, next) => {
	// Var encrypted = CryptoJS.AES.encrypt('Message', 'Secret Passphrase');
	// var decrypted = CryptoJS.AES.decrypt(encrypted, 'Secret Passphrase');
	if(!req.headers.apikey) {
		return res.sendStatus(403);
	}

	const encrypted = req.headers.apikey.toString();

	// Console.log(encrypted);

	const decrypted = CryptoJS.AES.decrypt(
		encrypted,
		process.env.EDGENODE_SECRET
	).toString(CryptoJS.enc.Utf8);

	// Console.log(encrypted.toString());
	const isAuthAPI = decrypted.split(':')[0] === 'AuthorizationAPI';
	const isStillValid = Date.now() - parseInt(decrypted.split(':')[1]) < 30000;

	isAuthAPI && isStillValid ? next() : res.sendStatus(403);
};

//
// // generate valid apikey for 1 min
// const CryptoJS = require('crypto-js');
//
// const date = Date.now();
//
// let messageToEncrypt = `AuthorizationAPI:${date}`;
//
// var encrypted = CryptoJS.AES.encrypt(messageToEncrypt, 'Secret Passphrase');
//
// var decrypted = CryptoJS.AES.decrypt(
// encrypted.toString(),
// 'Secret Passphrase'
// ).toString(CryptoJS.enc.Utf8);
//
