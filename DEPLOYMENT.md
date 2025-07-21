# Deployment Guide - Hubus Ecosystem

- *Версия**: 2.0.0 (Unified Architecture)
- *Дата**: 2025-01-11
- *Статус**: ✅ PRODUCTION READY

## 🏗️ Архитектура после модернизации

### Ключевые изменения

- **hubus-service** + **hubus-service** → **hubus-service**
- **gateway-service** остается отдельным для маршрутизации
- Упрощенная архитектура с повышенной производительностью

## 🚀 Порядок развертывания

### 1. Подготовка инфраструктуры

#### Системные требования

```bash

## Минимальные требования

- CPU: 4 cores
- RAM: 8GB
- Storage: 50GB SSD
- Network: 1Gbps

## Рекомендуемые требования

- CPU: 8 cores
- RAM: 16GB
- Storage: 100GB SSD
- Network: 10Gbps
```

#### Зависимости

```bash

## Node.js

node --version  # >= 18.0.0

npm --version   # >= 8.0.0

## Docker (опционально)

docker --version  # >= 20.0.0

docker-compose --version  # >= 2.0.0

```

### 2. Клонирование и установка

```bash

## Клонирование репозитория

git clone <https://github.com/startupus/hubus.git>
cd hubus

## Установка зависимостей для всех сервисов

npm run install:all

## Или для конкретных сервисов

cd services/hubus-service && npm install
cd services/gateway-service && npm install
cd services/agents-service && npm install
cd services/chat-service && npm install
```

### 3. Конфигурация переменных окружения

#### Hubus Service (.env)

```bash

## services/hubus-service/.env

NODE_ENV=production
PORT=3000

## AI Providers

OPENAI_API_KEY=sk-your-openai-key
OPENROUTER_API_KEY=sk-your-openrouter-key

## Logging

LOG_LEVEL=info
LOG_FILE=/var/log/hubus/hubus-service.log
```

#### Gateway Service (.env)

```bash

## services/gateway-service/.env

NODE_ENV=production
PORT=3010

## Service URLs

HUBUS_SERVICE_URL=<http://localhost:3000>
AGENTS_SERVICE_URL=<http://localhost:3006>
LOGINUS_URL=<http://localhost:3001>
BILINGUS_URL=<http://localhost:3003>

## JWT

JWT_SECRET=your-super-secret-jwt-key-change-in-production

## Rate Limiting

RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=1000
```

#### Agents Service (.env)

```bash

## services/agents-service/.env

NODE_ENV=production
PORT=3006

## Database

DATABASE_URL=postgresql://user:password@localhost:5432/agents

## AI Integration

HUBUS_SERVICE_URL=<http://localhost:3000>
OPENAI_API_KEY=sk-your-openai-key
```

#### Chat Service (.env)

```bash

## services/chat-service/.env

NODE_ENV=production
PORT=3001

## Service URLs

NEXT_PUBLIC_HUBUS_SERVICE_URL=<http://localhost:3000>
NEXT_PUBLIC_AGENTS_SERVICE_URL=<http://localhost:3006>
NEXT_PUBLIC_GATEWAY_SERVICE_URL=<http://localhost:3010>
```

### 4. Сборка сервисов

```bash

## Сборка всех сервисов

npm run build:all

## Или для конкретных сервисов

cd services/hubus-service && npm run build
cd services/gateway-service && npm run build
cd services/agents-service && npm run build
cd services/chat-service && npm run build
```

### 5. Запуск сервисов

#### Последовательность запуска

```bash

## 1. Логирование и аутентификация

cd services/loginus && npm start &

## 2. Основной AI сервис

cd services/hubus-service && npm start &

## 3. API Gateway

cd services/gateway-service && npm start &

## 4. AI Агенты

cd services/agents-service && npm start &

## 5. Пользовательский интерфейс

cd services/chat-service && npm start &

## 6. Остальные сервисы

cd services/bilingus-service && npm start &
cd services/situs-service && npm start &
```

#### Использование PM2 (рекомендуется)

```bash

## Установка PM2

npm install -g pm2

## Запуск всех сервисов

pm2 start ecosystem.config.js

## Мониторинг

pm2 monit

## Логи

pm2 logs

## Перезапуск

pm2 restart all
```

### 6. Конфигурация PM2

#### ecosystem.config.js

```javascript
module.exports = {
  apps: [
    {
      name: 'hubus-service',
      script: 'services/hubus-service/dist/index.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'gateway-service',
      script: 'services/gateway-service/dist/index.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3010
      }
    },
    {
      name: 'agents-service',
      script: 'services/agents-service/dist/index.js',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3006
      }
    },
    {
      name: 'chat-service',
      script: 'services/chat-service/dist/server.js',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
```

## 🐳 Docker Deployment

### Docker Compose

```yaml

## docker-compose.yml

version: '3.8'

services:
  hubus-service:
    build: ./services/hubus-service
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
    restart: unless-stopped

  gateway-service:
    build: ./services/gateway-service
    ports:
      - "3010:3010"
    environment:
      - NODE_ENV=production
      - HUBUS_SERVICE_URL=http://hubus-service:3000
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - hubus-service
    restart: unless-stopped

  agents-service:
    build: ./services/agents-service
    ports:
      - "3006:3006"
    environment:
      - NODE_ENV=production
      - HUBUS_SERVICE_URL=http://hubus-service:3000
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - hubus-service
    restart: unless-stopped

  chat-service:
    build: ./services/chat-service
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_HUBUS_SERVICE_URL=http://hubus-service:3000
      - NEXT_PUBLIC_AGENTS_SERVICE_URL=http://agents-service:3006
    depends_on:
      - hubus-service
      - agents-service
    restart: unless-stopped
```

### Запуск через Docker

```bash

## Сборка и запуск

docker-compose up -d

## Просмотр логов

docker-compose logs -f

## Остановка

docker-compose down
```

## ☸️ Kubernetes Deployment

### Namespace

```yaml

## k8s/namespace.yaml

apiVersion: v1
kind: Namespace
metadata:
  name: hubus
```

### Hubus Service

```yaml

## k8s/hubus-service.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: hubus-service
  namespace: hubus
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hubus-service
  template:
    metadata:
      labels:
        app: hubus-service
    spec:
      containers:
      - name: hubus-service
        image: hubus/hubus-service:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: hubus-secrets
              key: openai-api-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
- --
apiVersion: v1
kind: Service
metadata:
  name: hubus-service
  namespace: hubus
spec:
  selector:
    app: hubus-service
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP
```

### Gateway Service

```yaml

## k8s/gateway-service.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: gateway-service
  namespace: hubus
spec:
  replicas: 2
  selector:
    matchLabels:
      app: gateway-service
  template:
    metadata:
      labels:
        app: gateway-service
    spec:
      containers:
      - name: gateway-service
        image: hubus/gateway-service:latest
        ports:
        - containerPort: 3010
        env:
        - name: NODE_ENV
          value: "production"
        - name: HUBUS_SERVICE_URL
          value: "http://hubus-service:3000"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: hubus-secrets
              key: jwt-secret
- --
apiVersion: v1
kind: Service
metadata:
  name: gateway-service
  namespace: hubus
spec:
  selector:
    app: gateway-service
  ports:
  - port: 3010
    targetPort: 3010
  type: LoadBalancer
```

### Секреты

```yaml

## k8s/secrets.yaml

apiVersion: v1
kind: Secret
metadata:
  name: hubus-secrets
  namespace: hubus
type: Opaque
data:
  openai-api-key: <base64-encoded-key>
  openrouter-api-key: <base64-encoded-key>
  jwt-secret: <base64-encoded-secret>
```

### Применение конфигурации

```bash

## Создание namespace

kubectl apply -f k8s/namespace.yaml

## Создание секретов

kubectl apply -f k8s/secrets.yaml

## Развертывание сервисов

kubectl apply -f k8s/hubus-service.yaml
kubectl apply -f k8s/gateway-service.yaml
kubectl apply -f k8s/agents-service.yaml
kubectl apply -f k8s/chat-service.yaml

## Проверка статуса

kubectl get pods -n hubus
kubectl get services -n hubus
```

## 🔍 Мониторинг и логирование

### Health Checks

```bash

## Проверка всех сервисов

curl <http://localhost:3000/api/health>  # Hubus Service

curl <http://localhost:3010/health>      # Gateway Service

curl <http://localhost:3006/api/health>  # Agents Service

curl <http://localhost:3001/api/health>  # Chat Service

## Через Gateway

curl <http://localhost:3010/health/detailed>
```

### Логирование

```bash

## Структурированные логи

tail -f /var/log/hubus/hubus-service.log
tail -f /var/log/hubus/gateway-service.log

## PM2 логи

pm2 logs hubus-service
pm2 logs gateway-service
```

### Prometheus метрики

```bash

## Метрики сервисов

curl <http://localhost:3000/api/metrics>
curl <http://localhost:3010/metrics>
```

## 🚨 Troubleshooting

### Частые проблемы

#### Сервис не запускается

```bash

## Проверка портов

netstat -tlnp | grep :3000

## Проверка переменных окружения

env | grep -E "(OPENAI|OPENROUTER|JWT)"

## Проверка логов

pm2 logs hubus-service --lines 100
```

#### Ошибки аутентификации

```bash

## Проверка JWT секрета

echo $JWT_SECRET | wc -c  # Должно быть >= 32

## Проверка токена

curl -H "Authorization: Bearer $TOKEN" <http://localhost:3010/api/v1/auth/validate>
```

#### Проблемы с AI провайдерами

```bash

## Проверка API ключей

curl -H "Authorization: Bearer $OPENAI_API_KEY" <https://api.openai.com/v1/models>

## Проверка через Hubus

curl -X POST <http://localhost:3000/api/chat> \
  -H "Content-Type: application/json" \
  -d '{"model":"gpt-4o","messages":[{"role":"user","content":"test"}]}'
```

## 📊 Производительность

### Рекомендуемые настройки

#### Node.js

```bash

## Увеличение лимитов

export NODE_OPTIONS="--max-old-space-size=4096"

## Оптимизация для production

export NODE_ENV=production
```

#### PM2

```javascript
// ecosystem.config.js
{
  instances: 'max',  // Использовать все CPU
  exec_mode: 'cluster',
  max_memory_restart: '1G',
  node_args: '--max-old-space-size=1024'
}
```

### Мониторинг производительности

```bash

## CPU и память

top -p $(pgrep -f "hubus-service")

## Сетевые соединения

netstat -an | grep :3000

## Disk I/O

iotop -p $(pgrep -f "hubus-service")
```

## 🔄 Обновления

### Rolling Updates

```bash

## Обновление кода

git pull origin main

## Пересборка

npm run build:all

## Плавное обновление через PM2

pm2 reload ecosystem.config.js

## Или через Kubernetes

kubectl rollout restart deployment/hubus-service -n hubus
```

### Откат изменений

```bash

## PM2

pm2 rollback hubus-service

## Kubernetes

kubectl rollout undo deployment/hubus-service -n hubus
```

- --

- *Поддержка**: support@hubus.ai
- *Документация**: <https://docs.hubus.ai>
- *Мониторинг**: <https://status.hubus.ai>
