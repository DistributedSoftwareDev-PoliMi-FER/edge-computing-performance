var axios = require('axios').default;

const getPlaylist = async (streamId) => {
	try {
		const { data } = await axios.get(
			`${process.env.BASE_URL}/api/stream/${streamId}/index.m3u8`
		);
		return data;
	} catch (error) {
		// console.log(error);
		return null;
	}
};

const getChunk = async (streamId, chunk) => {
	try {
		const { status } = await axios.get(
			`${process.env.BASE_URL}/api/stream/${streamId}/${chunk}`
		);
		return status;
	} catch (error) {
		// console.log(error);
		return null;
	}
};

module.exports = {
	getPlaylist: getPlaylist,
	getChunk: getChunk,
};
