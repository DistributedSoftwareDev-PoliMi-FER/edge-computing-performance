const { body, validationResult } = require('express-validator');

function validationRules() {
	return [
		body('title')
			.not()
			.isEmpty()
			.trim()
			.escape()
			.withMessage('Non empty string expected'),
		body('thumbnail')
			.trim()
			.not()
			.isEmpty()
			.isURL()
			.withMessage('URL expected'),
		body('description')
			.not()
			.isEmpty()
			.trim()
			.escape()
			.withMessage('Non empty string expected'),
		body('invited').isArray().withMessage('Array expected (can be empty)'),
		body('type').not().isEmpty().isIn(['PUBLIC', 'PRIVATE']),
	];
}

function validate(req, res, next) {
	const errors = validationResult(req);
	if(errors.isEmpty()) {
		return next();
	}
	return res.status(422).json({
		errors: errors.array(),
	});
}

module.exports = {
	validationRules,
	validate,
};
