const axios = require('axios');
const CryptoJS = require('crypto-js');

const resolvedKeys = new Map();

function generateApiKey() {
	const date = Date.now();
	let messageToEncrypt = `AuthorizationAPI:${date}`;
	return CryptoJS.AES.encrypt(messageToEncrypt, process.env.EDGENODE_SECRET);
}

module.exports = (req, res, next) => {
	if(resolvedKeys.get(req.params.streamid)) {
		// Get an already resolved streamkey
		req.streamkey = resolvedKeys.get(req.params.streamid);
		next();
	}
	else {
		// Resolve and save the streamkey
		axios
			.get(
				`${process.env.MAIN_API_SERVICE_HOST}/edge-api/stream/${req.params.streamid}`,
				{
					headers: {
						apikey: generateApiKey(),
					},
				}
			)
			.then(({ data }) => {
				// Handle success
				req.streamkey = data.streamkey;
				resolvedKeys.set(req.params.streamid, req.streamkey);
				next();
			})
			.catch(() => {
				// Handle error
				return res.sendStatus(404);
			});
	}
};
