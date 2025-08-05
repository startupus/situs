# План очистки заглушек в системе

## 🔍 Найденные заглушки

### 1. Файлы с мок-данными (УДАЛИТЬ)
- ✅ `src/api/mockUsersData.ts` - мок пользователи **УДАЛЕН**
- ✅ `src/api/realDataAPI.ts` - demo проекты **УДАЛЕН**
- ✅ `src/api/users.ts` - мок режим API **УДАЛЕН**

### 2. Компоненты с hardcoded данными (ОБНОВИТЬ)
- ⚠️ `src/components/situs/pages/SitusWebsites.tsx` - mockWebsites
- ⚠️ `src/components/situs/pages/SitusStores.tsx` - mockStores
- ✅ `src/components/situs/pages/SitusOrders.tsx` - hardcoded orders **ОБНОВЛЕН**
- ✅ `src/components/situs/pages/SitusUsers.tsx` - mockUsers **ОБНОВЛЕН**
- ⚠️ `src/components/situs/pages/dashboardData.ts` - статические данные
- ⚠️ `src/components/situs/pages/SitusChatbots.tsx` - мок чат-боты
- ⚠️ `src/components/situs/pages/SitusProjects.tsx` - мок проекты
- ⚠️ `src/components/situs/pages/SitusSupport.tsx` - мок тикеты

### 3. TODO файлы (ОБНОВИТЬ/УДАЛИТЬ)
- ✅ `src/ai/TODO.md` - устаревшие задачи
- ✅ `src/editor/TODO.md` - ReactBricks интеграция
- ✅ `apps/studio/TODO.md` - studio задачи

### 4. Контексты с заглушками (УЖЕ ИСПРАВЛЕНО)
- ✅ `src/contexts/ProjectContext.tsx` - интегрирован с API
- ✅ `src/contexts/UserContext.tsx` - интегрирован с API

## 🎯 План действий

### Этап 1: Удаление устаревших файлов
1. Удалить `src/api/mockUsersData.ts`
2. Удалить `src/api/realDataAPI.ts` 
3. Удалить mock режим из `src/api/users.ts`

### Этап 2: Создание дополнительных API Services
1. Создать `src/api/services/orders.api.ts`
2. Создать `src/api/services/dashboard.api.ts`
3. Создать `src/api/services/support.api.ts`
4. Создать `src/api/services/ecommerce.api.ts`

### Этап 3: Обновление компонентов страниц
1. Интегрировать SitusOrders с orders API
2. Интегрировать SitusUsers с users API
3. Интегрировать SitusWebsites с projects API
4. Интегрировать SitusStores с ecommerce API
5. Интегрировать SitusDashboard с dashboard API
6. Интегрировать SitusSupport с support API

### Этап 4: Обновление Dashboard
1. Заменить статические данные на API calls
2. Добавить real-time обновления
3. Интегрировать с analytics API

### Этап 5: Очистка TODO файлов
1. Обновить актуальные TODO
2. Удалить устаревшие задачи
3. Создать новый roadmap

## ✅ Критерии успеха

- Нет файлов с mock/demo в названии
- Все компоненты используют реальные API
- Нет hardcoded массивов данных
- Все loading states работают корректно
- Error handling для всех API calls