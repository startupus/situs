# 🏗️ Микросервисная архитектура Situs

Этот раздел содержит все микросервисы платформы Situs, построенные на Node.js и TypeScript.

## 📋 Обзор сервисов

### 🔗 Gateway Service (Порт: 3000)
**Описание:** API Gateway для всех сервисов платформы
- **Роль:** Единая точка входа для всех API запросов
- **Функции:** 
  - Маршрутизация запросов к соответствующим сервисам
  - Аутентификация и авторизация
  - Rate limiting
  - Load balancing
  - CORS управление

### 🏢 Hubus Service (Порт: 3005)
**Описание:** Основной сервис для управления провайдерами
- **Роль:** Центральный сервис для работы с провайдерами услуг
- **Функции:**
  - Управление провайдерами
  - Интеграция с внешними API
  - Circuit breaker паттерн
  - Load balancing между провайдерами

### 💳 Bilingus Service (Порт: 3003)
**Описание:** Финансовый сервис для платежей и биллинга
- **Роль:** Обработка всех финансовых операций
- **Функции:**
  - Интеграция с платежными шлюзами (Stripe, PayPal)
  - Мультивалютность
  - PCI DSS соответствие
  - Управление подписками

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- npm или yarn
- Docker (опционально)

### Установка зависимостей
```bash
# Установка зависимостей для всех сервисов
cd services
for service in */; do
  echo "Устанавливаем зависимости для $service"
  cd "$service"
  npm install
  cd ..
done
```

### Запуск в режиме разработки
```bash
# Запуск всех сервисов
cd services
npm run dev:all

# Или запуск отдельных сервисов
cd hubus-service && npm run dev
cd gateway-service && npm run dev
cd bilingus-service && npm run dev
```

## 🔧 Конфигурация

### Переменные окружения

#### Gateway Service
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
HUBUS_PROXY_URL=http://localhost:3005
HUBUS_AGENTS_URL=http://localhost:3006
HUBUS_PROVIDER_URL=http://localhost:3007
HUBUS_CLIENT_URL=http://localhost:3008
LOGINUS_URL=http://localhost:3001
BILINGUS_URL=http://localhost:3003
SITUS_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:3002
CHAT_URL=http://localhost:3004
```

#### Hubus Service
```env
NODE_ENV=development
PORT=3005
DATABASE_URL=postgresql://user:pass@localhost:5432/hubus
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
OPENROUTER_API_KEY=your-openrouter-api-key
PROVIDER_SERVICE_URL=http://localhost:3007
CLIENT_SERVICE_URL=http://localhost:3008
```

#### Bilingus Service
```env
NODE_ENV=development
PORT=3003
DATABASE_URL=postgresql://user:pass@localhost:5432/bilingus
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

## 🧪 Тестирование

### Запуск тестов
```bash
# Тесты для всех сервисов
cd services
npm run test:all

# Тесты для конкретного сервиса
cd hubus-service && npm test
cd gateway-service && npm test
cd bilingus-service && npm test
```

### Покрытие кода
```bash
# Покрытие для всех сервисов
cd services
npm run coverage:all
```

## 📊 Мониторинг

### Health Checks
Каждый сервис предоставляет endpoint для проверки здоровья:

- **Gateway:** `GET /health`
- **Hubus:** `GET /health`
- **Bilingus:** `GET /health`

### Логирование
Все сервисы используют Winston для логирования:
- Логи сохраняются в папку `logs/`
- Разные уровни логирования для разных окружений
- Структурированные JSON логи для production

## 🔒 Безопасность

### Аутентификация
- JWT токены для аутентификации
- Минимальная длина JWT секрета: 32 символа
- Secure cookies в production

### Rate Limiting
- Настраиваемые лимиты запросов
- Разные лимиты для разных endpoints
- IP-based ограничения

### CORS
- Настраиваемые origins
- Credentials поддержка
- Безопасные заголовки

## 🏗️ Архитектура

### Паттерны
- **Circuit Breaker:** Для устойчивости к сбоям внешних сервисов
- **Load Balancer:** Распределение нагрузки между провайдерами
- **API Gateway:** Единая точка входа
- **Microservices:** Независимые сервисы

### Коммуникация
- HTTP/REST API между сервисами
- JSON для обмена данными
- Стандартные HTTP коды ответов

## 📈 Масштабирование

### Горизонтальное масштабирование
- Каждый сервис может быть развернут в нескольких экземплярах
- Load balancer автоматически распределяет нагрузку
- Stateless архитектура

### Вертикальное масштабирование
- Настраиваемые лимиты памяти и CPU
- Мониторинг производительности
- Автоматическое масштабирование

## 🚀 Деплой

### Docker
```bash
# Сборка образов
docker build -t situs/hubus-service ./hubus-service
docker build -t situs/gateway-service ./gateway-service
docker build -t situs/bilingus-service ./bilingus-service

# Запуск контейнеров
docker-compose up -d
```

### Kubernetes
```bash
# Применение конфигураций
kubectl apply -f k8s/
```

## 📚 Документация API

Каждый сервис предоставляет документацию API:
- **Gateway:** `/api/docs`
- **Hubus:** `/api/docs`
- **Bilingus:** `/api/docs`

## 🤝 Разработка

### Структура проекта
```
services/
├── gateway-service/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   └── package.json
├── hubus-service/
│   └── ...
├── bilingus-service/
│   └── ...
└── README.md
```

### Стандарты кода
- TypeScript для типизации
- ESLint для линтинга
- Prettier для форматирования
- Conventional Commits для коммитов

### Git Flow
- `main` - продакшн код
- `develop` - разработка
- `feature/*` - новые функции
- `hotfix/*` - срочные исправления 