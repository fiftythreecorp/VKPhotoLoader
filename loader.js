const fs = require("fs");
const request = require('request');
const vkAuth = require('vk-auth')(6334949, 1073741823);

var config = require('./config.json');
if(config.COUNT < 1) config.COUNT = 1;
if(config.COUNT > 5) config.COUNT = 5;
config.loaded = 0;

const randomInteger = (min, max) => {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

function printProgress(progress){
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write('Сохранили фото. Всего загружено фото: ' + progress);
}

	const getToken = (log, pass) => {
		return new Promise((resolve, reject) => {

			vkAuth.authorize(log, pass, function(err, tokenParams) {
				if(!err) {

					return resolve(tokenParams)

				} else return reject(err)
			});
		});
	}

	const api = (method, data) => {

		data.v = '5.87';

		var options = {
			method: 'GET',
			url: 'https://api.vk.com/method/' + method,
			qs: data
		}

		return new Promise((resolve, reject) => {
			request(options, (error, response, body) => {
				if(!error) {

					try {
						var data = JSON.parse(body);
					} catch(err) { 
						return reject(body);
					}

					if(data.error) return reject(data.error);
						return resolve(data.response);

				} else return reject(error);
			})
		});
	}	

	const savePhotos = (data) => {
		api('photos.save', {
			access_token: config.token,
			server: data.server,
			photos_list: data.photos_list,
			album_id: data.aid,
			hash: data.hash
		}).then(saveRes => {

			config.loaded += saveRes.length;
			printProgress(config.loaded)
			setTimeout(() => {
				savePhotos(data);
			}, 1000);

		}).catch(err => {

			console.log('Ошибка при сохранении фото');
				if(err.error_msg) console.log(err.error_msg);
				if(err.error_msg && err.error_msg == 'Unknown error occurred') return console.log('Лимит на загрузку фото');
				console.log('Ждем 30 секунд');
				setTimeout(getServer, 30000);

		})

	}

	const uploadPhoto = (url) => {

		formData = {};
		for(var i = 1; i <= config.COUNT; i++) {
			formData['file' + i] = fs.createReadStream(config.IMG_PATH);
		}

		var options = {
			method: 'POST',
			url: url,
			headers: {
				"Content-Type": "multipart/form-data"
			},
			formData: formData
		}

		request(options, (error, response, body) => {
			if(!error) {
				var data = JSON.parse(body);
				console.log('Загрузили фото, сохраняем в альбом');
				savePhotos(data);
			} else {

				console.log('Ошибка при загрузке фото', error, 'ждем 30 секунд.');
				setTimeout(getServer, 30000);

			}

		})

	}

	const getServer = () => {
		api('photos.getUploadServer', {
			access_token: config.token,
			album_id: config.ALBUM_ID
		}).then(uploadServer => {

			uploadPhoto(uploadServer.upload_url);

		}).catch(err => {
			console.log('Ошибка при получении сервера для загрузки фото');
			if(err.error_msg) console.log(err.error_msg);
			if(err.error_msg && err.error_msg == 'Access denied') return console.log('Неверный ID альбома.')
			setTimeout(getServer, 20000);
		})
	}


	getToken(config.VK_LOGIN, config.VK_PASSWORD).then(tokenData => {

		console.log('Получили токен', tokenData.access_token);
		config.token = tokenData.access_token;
		getServer();

	}).catch(err => {

		console.log('Ошибка при получении токена', err);

	});