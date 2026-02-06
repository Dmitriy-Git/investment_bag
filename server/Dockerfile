# Build stage
# Именно AS builder даёт имя этому этапу (stage)
FROM node:20-alpine AS builder
WORKDIR /app
# Копируем отдельно package.json и package-lock.json, чтобы кешировать зависимости
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
# Имя builder — это просто соглашение. Docker использует его для:
# --from=builder говорит: "возьми файлы из образа с именем builder".
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/src/generated ./src/generated
EXPOSE 3000
# Run Prisma migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]

# Важные моменты:
    # Только последний FROM определяет финальный образ, который сохраняется
    # Все предыдущие образы — временные и удаляются после сборки

# При docker-compose up
    # Используется уже готовый образ (production stage)
    # Выполняется только команда CMD (или command из compose)
    # Никакие RUN, COPY и т.д. не выполняются — они уже "запечены" в образ