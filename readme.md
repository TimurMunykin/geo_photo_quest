GPT Prompt:
# Что хочу
хочу на nodejs, видимо с экспрессом и reactjs и typescript, сделать проект.

# Описание проекта
Идея заключается в том что пользователь загружает набор фотографий на сервер, сервер же в свою очередь достает из этих фото геолокацию, располагает эти точки на карте и создает маршрут. Маршрут лучше создавать с использованием chatGPT(openAI API). Когда маршрут создан, то к нему можно подключить телеграмм бота который будет отдавать необходимую точку на карте. Т.е. бот - это своего рода к5вестодатель, он дает квест(фотографию), пользователь же должен угадать где находится эта точка на карте, приехать туда, скинуть геолокацию тому телеграм боту и бот в ответ выдаст вторую точку на карте.

# Технические особенности
проект будет состоять изх двух больших частей:
 - конфигуратор маршрута
 - бот который выдает маршрут точка за точкой.

Хочется сделать все по серьзеному, но с другой стоорны для начала сделать бы прототип. Так же хочу что бы все это паковалось в контейнеры докера, ну и было как микросервисная архитектура


docker compose up -d --build

swagger prod: https://767919-cf54261.tmweb.ru/api/api-docs/#/
swagger local dev: http://192.168.31.36:3000/api-docs/#