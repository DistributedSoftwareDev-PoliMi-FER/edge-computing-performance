const config = {
	rtmp: {
		port: 1935,
		chunk_size: 30000,
		gop_cache: true,
		ping: 60,
		ping_timeout: 30,
	},
	http: {
		port: 8888,
		mediaroot: './media',
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
};

module.exports = config;
