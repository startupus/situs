# 🔍 Code Review - Система управления проектами

## ❌ Критические проблемы

### 1. **Безопасность: Уязвимость в requireOwnership middleware**
**Файл:** `services/projects-service/src/middleware/auth.ts`
**Проблема:** Middleware проверяет `ownerId` из `req.body`, что позволяет пользователю подделать владельца ресурса.

```typescript
// ❌ УЯЗВИМОСТЬ
const resourceOwnerId = req.body[resourceUserIdField] || req.params[resourceUserIdField];
```

**Решение:** Убрать проверку из req.body, проверять владельца на уровне базы данных.

### 2. **База данных: Отсутствуют важные индексы**
**Файл:** `prisma/schema.prisma`
**Проблема:** Нет индексов для часто используемых полей поиска и фильтрации.

**Нужно добавить:**
- Индекс на `ownerId` + `status`
- Индекс на `domain` и `customDomain`
- Составной индекс для поиска

### 3. **Валидация: Проблема с DATABASE_URL**
**Файл:** `services/projects-service/src/config/environment.ts`
**Проблема:** Валидация как URL не поддерживает все форматы PostgreSQL connection strings.

```typescript
// ❌ Слишком строгая валидация
DATABASE_URL: z.string().url('Некорректный DATABASE_URL'),
```

## ⚠️ Серьезные проблемы

### 4. **Обработка ошибок: Некорректная логика в JSON verify**
**Файл:** `services/projects-service/src/index.ts`
**Проблема:** Verify callback в express.json выбрасывает исключение, что может привести к краху сервера.

```typescript
// ❌ Проблематично
verify: (req, res, buf) => {
  try {
    JSON.parse(buf.toString());
  } catch (e) {
    res.status(400).json({...});
    throw new Error('Invalid JSON'); // ❌ Может крашить сервер
  }
}
```

### 5. **Безопасность: Отсутствует валидация прав доступа**
**Файл:** `services/projects-service/src/routes/projects.ts`
**Проблема:** Маршруты check-slug и check-domain не требуют аутентификации.

### 6. **Производительность: N+1 проблема в getProjects**
**Файл:** `services/projects-service/src/services/projectsService.ts`
**Проблема:** Загружается слишком много связанных данных без необходимости.

### 7. **Типизация: Использование any в нескольких местах**
**Файлы:** Различные
**Проблема:** Потеря типобезопасности.

## 🔧 Рекомендации по улучшению

### 8. **Логирование: Недостаточно структурированных логов**
**Проблема:** Не хватает корреляционных ID для трейсинга запросов.

### 9. **Конфигурация: Жестко заданные значения**
**Проблема:** Некоторые лимиты и настройки не конфигурируются.

### 10. **Тестирование: Отсутствуют тесты**
**Проблема:** Полное отсутствие автотестов.

---

## 🚨 PRIORITY FIXES (Критично исправить)

### 1. Исправление уязвимости в requireOwnership

**Создать безопасный middleware:**
```typescript
export const requireProjectOwnership = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Пользователь не аутентифицирован'
      });
    }

    const projectId = req.params.id;
    if (!projectId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'ID проекта не найден'
      });
    }

    try {
      // Проверяем на уровне БД
      const project = await prisma.project.findFirst({
        where: { 
          id: projectId,
          ownerId: req.user.id 
        },
        select: { id: true }
      });

      if (!project && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Доступ запрещен'
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Ошибка проверки прав доступа'
      });
    }
  };
};
```

### 2. Добавление индексов в Prisma схему

```prisma
model Project {
  // ... existing fields ...
  
  @@index([ownerId, status])
  @@index([domain])
  @@index([customDomain])
  @@index([ownerId, updatedAt])
  @@index([slug])
}
```

### 3. Исправление DATABASE_URL валидации

```typescript
DATABASE_URL: z.string().min(1, 'DATABASE_URL обязателен'),
```

### 4. Исправление JSON verify

```typescript
app.use(express.json({ 
  limit: '10mb'
  // Убираем verify - Express сам обработает некорректный JSON
}));
```

### 5. Добавление аутентификации для utility endpoints

```typescript
// В routes/projects.ts
router.get('/check-slug/:slug', authenticateToken, ProjectsController.checkSlugAvailability);
router.get('/check-domain/:domain', authenticateToken, ProjectsController.checkDomainAvailability);
```

---

## 📊 Статистика найденных проблем

- **Критические (Security):** 2
- **Серьезные (Bugs/Performance):** 5  
- **Улучшения (Best Practices):** 3
- **Общий рейтинг:** 6/10 ⭐

## 🎯 План исправлений

### Фаза 1 - Критические исправления (1-2 дня)
1. Исправить requireOwnership уязвимость
2. Добавить индексы в БД
3. Исправить валидацию DATABASE_URL
4. Убрать проблемный JSON verify

### Фаза 2 - Безопасность и производительность (2-3 дня)  
5. Добавить аутентификацию в utility endpoints
6. Оптимизировать N+1 запросы
7. Улучшить типизацию
8. Добавить корреляционные ID

### Фаза 3 - Тестирование и документация (3-5 дней)
9. Написать автотесты
10. Улучшить логирование
11. Создать OpenAPI документацию
12. Настроить CI/CD пайплайн

## ✅ После исправления система будет готова к production