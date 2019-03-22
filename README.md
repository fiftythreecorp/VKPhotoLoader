## VKPhotoLoader
Скрипт для быстрого добавления одинаковых фото в свой альбом ВКонтакте.
<p align="center"><img src="https://raw.githubusercontent.com/fiftythreecorp/VKPhotoLoader/master/limit.png"><br><a href='https://vk.com/id502486221' target='_blank'>example</a></p>

## Установка
Для работы необходимо [скачать и установить Node.js](https://nodejs.org/en/download/),
и установить модули *request*, *vk-auth*
```sh
npm install request
```
```sh
npm install vk-auth
```

## Настройка
- В файле config.json указать
	- Логин и пароль от ВКонтакте.
	- ID альбома, в который будут сохраняться фотографии.
	- Путь до фотографии.

## Запуск
Чтобы начать добавлять фотографии в альбом, введите команду
```sh
node loader.js
```
## Дополнительная информация
- Лимит на количество фотографий в одном альбоме: 10000.
- Лимит на загрузку фотографий: 10000 фото в сутки.
- После 710,000 фотографий на аккаунте выдает ошибку при загрузке. В поддержке ответили, что фотографий на аккаунте слишком много, и для загрузки новых нужно удалить старые.
- <img src="https://raw.githubusercontent.com/fiftythreecorp/VKPhotoLoader/master/limit.png">
- <img src="https://raw.githubusercontent.com/fiftythreecorp/VKPhotoLoader/master/supprot.png">

    
	
