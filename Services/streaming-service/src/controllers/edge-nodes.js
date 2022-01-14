exports.getKey = (req, res, next) => {
	res.json({ streamkey: req.streamkey });
	next();
};
