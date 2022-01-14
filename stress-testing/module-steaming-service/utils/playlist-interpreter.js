const parsePlaylist = (m3u8String) => {
	m3u8String = m3u8String.replaceAll(',', '');
	const playlist = m3u8String.split('\n');
	const segments = [];
	let targetDuration = Number(playlist[2].split(':')[1]);
	let startingElem = Number(playlist[3].split(':')[1]);
	let currentElem = Number(playlist[3].split(':')[1]);
	for (let i = 4; i < playlist.length; i++) {
		if (playlist[i].includes('#EXTINF')) {
			let duration = Number(playlist[i].split(':')[1]);
			let chunk = playlist[i + 1];
			let chunkIndex = currentElem;
			segments.push({
				duration,
				chunk,
				chunkIndex,
			});
			currentElem++;
		}
	}
	return {
		startingElem,
		lastElem: startingElem + segments.length,
		segments,
		targetDuration,
	};
	// console.log(playlist);
};

module.exports = {
	parsePlaylist: parsePlaylist,
};
