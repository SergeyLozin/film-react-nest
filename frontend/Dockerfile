# ============================================
# Stage 1: Builder — сборка фронтенда
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем ВСЕ зависимости (включая dev)
RUN npm install

# Копируем исходники
COPY . .

# Собираем фронтенд (получим dist/)
RUN npm run build

# ============================================
# Stage 2: Production — только собранная статика
# ============================================
FROM alpine:latest AS production

WORKDIR /app

# Копируем собранный фронтенд из builder
COPY --from=builder /app/dist ./dist

# Контейнер нужен только для volume — отдаёт статику в nginx
CMD ["sh", "-c", "echo 'Frontend build ready' && sleep infinity"]