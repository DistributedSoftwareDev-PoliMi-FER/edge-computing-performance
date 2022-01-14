// Import NPM Modules
const axios = require('axios').default;
const validator = require('validator').default;

let token = '';

const userIds = new Map();
const usernames = new Map();

const cacheDuration = 300000;

async function translateId(userId) {
	var config = {
		method: 'get',
		url: `${process.env.AUTH0_API_URL}/api/v2/users/${userId}`,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	};

	return axios(config);
}

function arrToSting(type, list) {
	const queryContent = validator.escape(
		`${type}=${list.toString().replaceAll(',', ' OR ')}&search_engine=v3`
	);
	return `q=${queryContent}`;
}

async function translateMulipleUsernames(list) {
	// Check if the user is already translated
	let translated = [];
	let toTranslate = [];
	for (let i = 0; i < list.length; i++) {
		let translatedUser = usernames.get(list[i]);
		if (translatedUser) {
			translated.push(translatedUser);
		} else {
			toTranslate.push(list[i]);
		}
	}

	if (toTranslate.length > 0) {
		const query = arrToSting('username', list);
		var config = {
			method: 'get',
			url: `${process.env.AUTH0_API_URL}/api/v2/users?${query}`,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		let { data } = await axios(config);
		data = data.map(
			(user) => new Object({ username: user.username, userId: user.user_id })
		);
		for (let i = 0; i < data.length; i++) {
			translated.push(data[i].userId);
			usernames.set(data[i].username, data[i].userId);
			setTimeout(() => {
				usernames.delete(data[i].username);
			}, cacheDuration);
		}
	}

	return translated;
}

async function translateMulipleUserIds(list) {
	// Check if the user is already translated
	let translated = [];
	let toTranslate = [];
	for (let i = 0; i < list.length; i++) {
		let translatedUser = userIds.get(list[i]);
		if (translatedUser) {
			translated.push(translatedUser);
		} else {
			toTranslate.push(list[i]);
		}
	}

	if (toTranslate.length > 0) {
		const query = arrToSting('user_id', toTranslate);
		var config = {
			method: 'get',
			url: `${process.env.AUTH0_API_URL}/api/v2/users?${query}`,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		};
		let { data } = await axios(config);
		data = data.map(
			(user) => new Object({ username: user.username, userId: user.user_id })
		);
		for (let i = 0; i < data.length; i++) {
			translated.push(data[i].username);
			userIds.set(data[i].userId, data[i].username);
			setTimeout(() => {
				userIds.delete(data[i].userId);
			}, cacheDuration);
		}
	}

	return translated;
}

async function translateOneUserId(userid) {
	const users = await translateMulipleUserIds([userid]);
	return users[0];
}

async function setToken() {
	var config = {
		method: 'post',
		url: `${process.env.AUTH0_API_URL}/oauth/token`,
		data: {
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			audience: process.env.AUDIENCE,
			grant_type: 'client_credentials',
		},
	};
	const { data } = await axios(config);
	token = data.access_token;
}

function updateToken() {
	setToken();

	setInterval(() => {
		setToken();
	}, 3600000);
}

module.exports = {
	translateId: translateId,
	translateMulipleUsernames: translateMulipleUsernames,
	translateMulipleUserIds: translateMulipleUserIds,
	translateOneUserId: translateOneUserId,
	updateToken: updateToken,
};
