var axios = require('axios').default;

const requestPublicStreams = async () => {
	try {
		const { data } = await axios.get(
			`${process.env.BASE_URL}/api/stream/public`
		);
		return data;
	} catch (error) {
		console.log(error);
		return undefined;
	}
};

exports.requestPublicStreams = requestPublicStreams;
