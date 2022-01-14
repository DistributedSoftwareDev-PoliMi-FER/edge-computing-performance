const ffmpeg = `/usr/bin/ffmpeg -stream_loop -1 -re -nostdin `;
const fileName = 'nevergonnagiveyouup.mp4';
const params = ` -vcodec libx264 -preset:v ultrafast -acodec aac -b:v 1M -bufsize 1M -force_key_frames "expr:gte(t,n_forced*1)" -f flv rtmp://localhost/live/`;

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function startStream(streamKey, basefolder) {
	const filePath = '-i ./' + basefolder + fileName;
	const command = ffmpeg + filePath + params;
	try {
		const { stdout, stderr } = await exec(`${command}${streamKey}`);
		// Console.log('stdout:', stdout);
		console.log('stderr:', stderr);
	} catch (err) {
		console.error(err);
	}
}

module.exports = startStream;
