# 🔍 Health Monitor - Быстрый справочник

## Назначение

`scripts/health-monitor.js` - автоматизированная система мониторинга здоровья всех сервисов проекта Situs.

## Быстрый старт

```bash
# Разовая проверка
node scripts/health-monitor.js

# Непрерывный мониторинг
node scripts/health-monitor.js --continuous

# Через npm
npm run health:check
```

## Что проверяется

### Сервисы

- ✅ **API Health** (`/api/health`) - статус 200, body `{status: "ok"}`
- ✅ **Frontend** (`http://localhost:5177`) - доступность главной страницы
- ✅ **Prisma Studio** (`http://localhost:5555`) - доступность админки БД

### Docker контейнеры

- ✅ `situs-postgres` - PostgreSQL база данных
- ✅ `situs-redis` - Redis кэш
- ✅ `situs-api` - Backend API
- ✅ `situs-web` - Frontend
- ✅ `situs-prisma-studio` - Prisma Studio

### Системные ресурсы

- ✅ Использование диска
- ✅ Версии Node.js и npm
- ✅ Доступность портов

## Отчет

Генерируется файл `health-report.json` с детальной информацией:

- Статус каждого сервиса (healthy/unhealthy)
- Состояние Docker контейнеров
- Системные ресурсы
- Временные метки
- Общий статус системы

## Типичные проблемы

### ❌ "API Health check failed"

```bash
# Решение: Запустить API
npm run dev:api:watch
# или
npm run nestjs:build && PORT=3002 npm run serve:api:dist
```

### ❌ "Frontend is unhealthy"

```bash
# Решение: Запустить Frontend
npm run dev:situs
```

### ❌ "Docker services not found"

```bash
# Решение: Запустить Docker контейнеры
docker compose up -d
```

### ❌ "Port already in use"

```bash
# Решение: Проверить и освободить порты
lsof -i :3002  # API
lsof -i :5177  # Frontend
lsof -i :5555  # Prisma Studio
```

## Интеграция в CI/CD

```bash
# В pipeline перед деплоем
npm run validate:build
node scripts/health-monitor.js
npm run test:e2e

# Проверка exit code
if [ $? -eq 0 ]; then
  echo "All services healthy, proceeding with deployment"
else
  echo "Health check failed, aborting deployment"
  exit 1
fi
```

## Настройка мониторинга

### Непрерывный мониторинг в production

```bash
# Запуск в фоне
nohup node scripts/health-monitor.js --continuous > health-monitor.log 2>&1 &

# Или через systemd
sudo systemctl enable situs-health-monitor
sudo systemctl start situs-health-monitor
```

### Алерты

Health Monitor возвращает exit code:

- `0` - все сервисы здоровы
- `1` - есть проблемы

Используйте для интеграции с системами мониторинга (Nagios, Zabbix, etc.)

## Расширение функциональности

### Добавление нового сервиса

Отредактируйте `config.services` в `scripts/health-monitor.js`:

```javascript
{
  name: 'New Service',
  url: 'http://localhost:8080/health',
  timeout: 5000,
  expectedStatus: 200,
  expectedBody: { status: 'ok' }
}
```

### Добавление Docker контейнера

Отредактируйте `config.dockerServices`:

```javascript
const dockerServices = [
  'situs-postgres',
  'situs-redis',
  'situs-api',
  'situs-web',
  'situs-prisma-studio',
  'new-service', // Добавить новый контейнер
];
```

## Логирование

Health Monitor использует структурированное логирование:

- `[INFO]` - информационные сообщения
- `[SUCCESS]` - успешные проверки
- `[WARNING]` - предупреждения
- `[ERROR]` - ошибки
- `[STEP]` - этапы выполнения

## Troubleshooting

### Проблема: Health monitor не запускается

```bash
# Проверить права доступа
chmod +x scripts/health-monitor.js

# Проверить Node.js версию
node --version  # Должна быть 18+
```

### Проблема: False positive результаты

- Проверьте timeout настройки
- Убедитесь в правильности expectedStatus и expectedBody
- Проверьте доступность сервисов вручную

### Проблема: Медленная работа

- Уменьшите timeout для быстрых проверок
- Исключите несущественные сервисы
- Используйте параллельные проверки
