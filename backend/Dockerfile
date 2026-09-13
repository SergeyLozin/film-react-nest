# ============================================
# Stage 1: Builder — сборка приложения
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая dev для сборки)
RUN npm ci

# Копируем исходники
COPY . .

# Собираем приложение
RUN npm run build

# ============================================
# Stage 2: Production — финальный образ
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Копируем package.json для установки production-зависимостей
COPY package*.json ./

# Устанавливаем ТОЛЬКО production-зависимости
RUN npm ci --omit=dev

# Копируем собранный код из builder
COPY --from=builder /app/dist ./dist

# Копируем статику (public)
COPY --from=builder /app/public ./public

# Открываем порт
EXPOSE 3001

# Запускаем production-код
CMD ["node", "dist/main.js"]