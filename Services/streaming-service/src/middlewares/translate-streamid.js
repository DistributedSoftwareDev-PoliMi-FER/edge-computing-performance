// Const axios = require('axios');

const Stream = require('../models/stream');

const resolvedKeys = new Map();

module.exports = (req, res, next) => {
	if(resolvedKeys.get(req.params.streamid)) {
		// Get an already resolved streamkey
		req.streamkey = resolvedKeys.get(req.params.streamid);
		next();
	}
	else {
		Stream.findById(req.params.streamid)
			.then((stream) => {
				if(!stream) {
					// No stream found
					return res.sendStatus(404);
				}
				// Stream found
				req.streamkey = stream.streamkey;
				resolvedKeys.set(req.params.streamid, stream.streamkey);
				next();
			})
			.catch(() => {
				return res.sendStatus(404);
			});
	}
};
