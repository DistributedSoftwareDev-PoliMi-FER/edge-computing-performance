exports.authenticate = (req, res, next) => {
	// Console.log('Mocked user auth');
	req.user = { sub: 'auth0|61b1b71450f671006bf84beb' };
	next();
};
