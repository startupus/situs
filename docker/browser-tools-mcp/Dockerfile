FROM node:18-alpine

WORKDIR /app

# Установка необходимых зависимостей для Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Создание директории для скриншотов
RUN mkdir -p /app/screenshots

# Настройка переменных окружения для Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Открытие портов
EXPOSE 3025

# Команда по умолчанию
CMD ["npx", "@agentdeskai/browser-tools-server@latest"] 