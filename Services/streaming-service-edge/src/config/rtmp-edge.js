const config = {
	rtmp: {
		port: 2935,
		chunk_size: 60000,
		gop_cache: true,
		ping: 30,
		ping_timeout: 60,
	},
	http: {
		port: 7777,
		mediaroot: './edge-media',
		allow_origin: '*',
	},
	trans: {
		ffmpeg: '/usr/bin/ffmpeg',
		tasks: [
			{
				app: 'live',
				rtmp: true,
				hls: true,
				hlsFlags: '[hls_time=1:hls_list_size=8:hls_flags=delete_segments]',
			},
		],
	},
	relay: {
		ffmpeg: '/usr/bin/ffmpeg',
		tasks: [
			{
				app: 'live',
				mode: 'pull',
				edge: process.env.RTMP_MAIN_SERVER,
			},
		],
	},
};

module.exports = config;
