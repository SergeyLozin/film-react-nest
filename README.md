# Film!

Онлайн-сервис бронирования билетов в кинотеатр.

## Демо

- Фронтенд: https://lozo.students.nomorepartiessite.ru
- API: https://api.lozo.students.nomorepartiessite.ru/api/afisha/films
- pgAdmin: http://lozo.students.nomorepartiessite.ru:8080

## Технологии

- Frontend: React + Vite + TypeScript
- Backend: Nest.js + TypeORM + PostgreSQL
- Infrastructure: Docker + Nginx + GitHub Actions
- Container Registry: GitHub Container Registry (GHCR)
- Hosting: Yandex Cloud
- SSL: Let's Encrypt (Certbot)

## Быстрый старт

### Требования

- Docker
- Docker Compose

### Запуск

docker compose up -d --build

После запуска откройте:

- Фронтенд: http://localhost
- API: http://localhost/api/afisha/films
- pgAdmin: http://localhost:8080

### Остановка

docker compose down

Для полного сброса (с удалением данных БД):

docker compose down -v

## Production

Для запуска на сервере используется docker-compose.prod.yml — образы берутся из GitHub Container Registry без локальной сборки.

docker compose -f docker-compose.prod.yml up -d

## Локальная разработка

### Бэкенд

cd backend
npm ci
cp .env.example .env
npm run start:dev

Переменные окружения в .env:

- DATABASE_DRIVER — тип драйвера СУБД (postgres)
- DATABASE_HOST — хост базы данных
- DATABASE_PORT — порт базы данных
- DATABASE_NAME — имя базы данных
- DATABASE_USERNAME — пользователь базы данных
- DATABASE_PASSWORD — пароль базы данных
- PORT — порт бэкенда
- LOGGER_TYPE — тип логгера (dev, json, tskv)

### Фронтенд

cd frontend
npm ci
npm run dev

## Документация API

- OpenAPI-спецификация: film.yml
- Коллекция Postman: film.postman.json

## Тесты

cd backend
npm test

Доступные команды:

- npm test — запуск всех тестов
- npm run test:watch — запуск в режиме наблюдения
- npm run test:cov — запуск с покрытием

## Логирование

Поддерживается три режима логирования, выбираются через переменную окружения LOGGER_TYPE:

- dev — цветные логи для разработки (по умолчанию)
- json — структурированные логи в формате JSON
- tskv — логи в формате TSKV (Tab-Separated Key-Value)

Пример:

LOGGER_TYPE=json npm run start:dev

## Структура проекта

film-react-nest/
├── backend/              # Бэкенд на Nest.js
│   ├── src/
│   │   ├── films/        # Модуль фильмов
│   │   ├── order/        # Модуль заказов
│   │   ├── repository/   # Репозитории TypeORM
│   │   ├── logger/       # Логгеры
│   │   └── config/       # Конфигурация
│   └── test/             # Тесты и SQL-скрипты
├── frontend/             # Фронтенд на React
│   └── src/
│       ├── components/   # Компоненты
│       └── utils/        # Утилиты
├── nginx/                # Конфигурация nginx
├── .github/workflows/    # GitHub Actions
├── docker-compose.yml    # Docker Compose для локальной разработки
└── docker-compose.prod.yml  # Docker Compose для продакшена

## CI/CD

При пуше в ветки main и review-2 запускается GitHub Actions workflow, который:

1. Собирает три Docker-образа: film-backend, film-frontend, film-nginx
2. Публикует их в GitHub Container Registry
3. Образы доступны для деплоя на сервере

Ссылка на workflow: .github/workflows/deploy.yml

## Лицензия

MIT