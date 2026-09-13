-- Создаём базу данных
CREATE DATABASE film;

-- Подключаемся к базе film
\c film;

-- Таблица фильмов
CREATE TABLE IF NOT EXISTS films (
    id UUID PRIMARY KEY,
    rating DECIMAL(3,1) NOT NULL,
    director VARCHAR(255) NOT NULL,
    tags TEXT[] NOT NULL,
    title VARCHAR(255) NOT NULL,
    about TEXT NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    cover VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица сеансов (связь один-ко-многим с films)
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY,
    film_id UUID NOT NULL REFERENCES films(id) ON DELETE CASCADE,
    daytime TIMESTAMP NOT NULL,
    hall VARCHAR(50) NOT NULL,
    rows INTEGER NOT NULL,
    seats INTEGER NOT NULL,
    price INTEGER NOT NULL,
    taken TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Таблица заказов (для хранения бронирований)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    tickets JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для ускорения запросов
CREATE INDEX idx_schedules_film_id ON schedules(film_id);
CREATE INDEX idx_schedules_daytime ON schedules(daytime);