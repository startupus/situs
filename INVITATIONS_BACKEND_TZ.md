# Техническое задание: Система приглашений пользователей

## Обзор

Данное ТЗ описывает реализацию полноценной системы приглашений пользователей с поддержкой различных каналов связи для платформы Situs.

## 1. Архитектура системы

### 1.1 Компоненты системы
- **InvitationsModule** - основной модуль приглашений
- **CommunicationModule** - модуль каналов связи
- **Frontend UI** - интерфейс управления приглашениями

### 1.2 База данных

#### Таблица `invitations`
```sql
CREATE TABLE invitations (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'BUSINESS',
    status TEXT NOT NULL DEFAULT 'PENDING',
    token TEXT NOT NULL UNIQUE,
    message TEXT,
    channel TEXT NOT NULL DEFAULT 'EMAIL',
    invitedBy TEXT NOT NULL,
    acceptedBy TEXT,
    expiresAt DATETIME NOT NULL,
    sentAt DATETIME,
    acceptedAt DATETIME,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (invitedBy) REFERENCES users (id),
    FOREIGN KEY (acceptedBy) REFERENCES users (id)
);
```

#### Таблица `communication_settings`
```sql
CREATE TABLE communication_settings (
    id TEXT PRIMARY KEY,
    channel TEXT NOT NULL UNIQUE,
    enabled BOOLEAN NOT NULL DEFAULT false,
    config TEXT NOT NULL, -- JSON конфигурация
    inviteTemplate TEXT,
    reminderTemplate TEXT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL
);
```

## 2. Backend API

### 2.1 Endpoints приглашений

#### POST /api/invitations
Создание приглашений
```typescript
{
  emails: string[];
  role: GlobalRole;
  message?: string;
  channel: CommunicationChannel;
  expiresAt?: string;
}
```

#### GET /api/invitations
Получение списка приглашений с пагинацией и фильтрацией

#### GET /api/invitations/by-token/:token (публичный)
Получение приглашения по токену для принятия

#### POST /api/invitations/accept (публичный)
Принятие приглашения и создание пользователя

#### POST /api/invitations/:id/resend
Повторная отправка приглашения

#### POST /api/invitations/:id/cancel
Отмена приглашения

### 2.2 Каналы связи

#### Поддерживаемые каналы:
1. **EMAIL** (MVP) - реализовано с логированием
2. **SMS** - заглушка (в разработке)
3. **TELEGRAM** - заглушка (в разработке)
4. **WHATSAPP** - заглушка (в разработке)
5. **SLACK** - заглушка (в разработке)

#### Архитектура каналов:
```typescript
interface CommunicationMessage {
  to: string;
  subject?: string;
  content: string;
  template?: string;
  variables?: Record<string, any>;
}

interface CommunicationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
```

## 3. Frontend

### 3.1 Компоненты
- **UserInvites.tsx** - основной компонент управления приглашениями
- **InvitationsAPI** - API клиент для работы с приглашениями

### 3.2 Функциональность
- ✅ Создание приглашений через модальное окно (TailGrids дизайн)
- ✅ Отображение списка приглашений в таблице
- ✅ Управление приглашениями (отмена, повторная отправка, удаление)
- ✅ Фильтрация и поиск приглашений
- ✅ Real-time обновления через SSE

### 3.3 Использованные компоненты
- **TailGrids React Components** (`Upload/react-pro-components-main/`)
- **React Icons** (FiMail, FiClock, FiCheck, etc.)
- **Tailwind CSS** для стилизации

## 4. Статусы приглашений

```typescript
enum InvitationStatus {
  PENDING = 'PENDING',     // Ожидает принятия
  ACCEPTED = 'ACCEPTED',   // Принято
  EXPIRED = 'EXPIRED',     // Истекло
  CANCELLED = 'CANCELLED'  // Отменено
}
```

## 5. Роли пользователей

```typescript
enum GlobalRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  STAFF = 'STAFF',
  AGENCY = 'AGENCY',
  BUSINESS = 'BUSINESS'
}
```

## 6. Безопасность

### 6.1 Авторизация
- Все административные endpoints требуют JWT авторизации
- Публичные endpoints: `by-token/:token`, `accept`

### 6.2 Валидация
- Email валидация на frontend и backend
- Проверка уникальности токенов
- Проверка срока действия приглашений

## 7. Настройки каналов связи

### 7.1 Глобальные настройки
Настройки каналов связи должны быть доступны в разделе:
`http://localhost:5177/section-settings/dashboard`

### 7.2 Конфигурация каналов
```typescript
// EMAIL
{
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    }
  }
}

// SMS (Twilio)
{
  provider: 'twilio';
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

// TELEGRAM
{
  botToken: string;
  chatId: string;
}
```

## 8. Шаблоны сообщений

### 8.1 Переменные шаблонов
- `{{inviteLink}}` - ссылка для принятия приглашения
- `{{email}}` - email приглашенного
- `{{expiresAt}}` - дата истечения
- `{{message}}` - персональное сообщение

### 8.2 Пример шаблона EMAIL
```
Вы приглашены присоединиться к нашей платформе!

Для принятия приглашения перейдите по ссылке:
{{inviteLink}}

Приглашение действительно до: {{expiresAt}}

{{message}}

С уважением,
Команда Situs
```

## 9. Реализованные файлы

### 9.1 Backend
- `src/server/invitations/` - модуль приглашений
  - `invitations.service.ts` - бизнес-логика
  - `invitations.controller.ts` - API endpoints
  - `invitations.module.ts` - NestJS модуль
  - `dto/` - объекты передачи данных
  - `entities/` - типы данных
- `src/server/communication/` - модуль каналов связи
  - `communication.service.ts` - сервис отправки сообщений
  - `communication.module.ts` - NestJS модуль

### 9.2 Frontend
- `src/components/situs/pages/users/UserInvites.tsx` - UI компонент
- `src/api/services/invitations.api.ts` - API клиент

### 9.3 База данных
- `prisma/schema.prisma` - схема данных
- `scripts/seed-invitations.ts` - мок данные

## 10. Текущий статус

### ✅ Реализовано
- Полная backend архитектура
- База данных и миграции
- Frontend интерфейс с TailGrids дизайном
- EMAIL канал (с логированием)
- Заглушки для остальных каналов
- Мок данные для тестирования

### 🔄 В процессе
- Интеграция с авторизацией (JWT)
- Настройки каналов в глобальных настройках

### 📋 Планируется
- Реальная отправка EMAIL через SMTP
- Интеграция с SMS провайдерами
- Telegram Bot API
- WhatsApp Business API
- Slack Webhooks

## 11. Ссылки и источники

### 11.1 Компоненты
- **TailGrids React Components**: `Upload/react-pro-components-main/`
- **React Icons**: https://react-icons.github.io/react-icons/
- **Tailwind CSS**: https://tailwindcss.com/

### 11.2 API документация
- **NestJS**: https://nestjs.com/
- **Prisma**: https://www.prisma.io/
- **JWT**: https://jwt.io/

### 11.3 Каналы связи
- **Nodemailer** (EMAIL): https://nodemailer.com/
- **Twilio** (SMS/WhatsApp): https://www.twilio.com/
- **Telegram Bot API**: https://core.telegram.org/bots/api
- **Slack API**: https://api.slack.com/

## 12. Следующие шаги

1. **Исправить авторизацию** - добавить JWT middleware
2. **Добавить настройки каналов** в глобальные настройки
3. **Реализовать реальную отправку EMAIL**
4. **Создать страницу принятия приглашений**
5. **Добавить уведомления и логирование**
6. **Интегрировать с остальными каналами связи**

---

*Документ создан: 24.08.2024*
*Версия: 1.0*
