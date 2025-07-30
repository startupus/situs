# 🔍 Анализ функциональности создания и редактирования проектов

## 🎯 Задача
Проанализировать почему **создание и редактирование проектов не работает**, и развернуть сайт "Стартапус" как демонстрационный проект.

## 📊 Текущее состояние

### ✅ **Что работает:**
1. **API сервисы** - полноценные endpoints для проектов
2. **База данных** - Prisma схема с проектами и страницами
3. **UI компоненты** - интерфейс для создания и редактирования
4. **Контексты** - SiteContext и ProjectContext
5. **Роутинг** - маршруты для проектов

### ❌ **Что НЕ работает:**
1. **Создание проектов** - модальное окно есть, но не создает реальные проекты
2. **Редактирование проектов** - кнопки есть, но функционал не работает
3. **Демо проект "Стартапус"** - не отображается в интерфейсе

## 🔍 Анализ проблем

### **1. Проблема с созданием проектов**

**Место:** `src/pages/ProjectSelector.tsx`
```typescript
const handleCreateProject = async () => {
  const projectName = `Новый ${selectedProjectType === 'website' ? 'сайт' : 
    selectedProjectType === 'ecommerce' ? 'магазин' : 
    selectedProjectType === 'landing' ? 'лендинг' : 'блог'}`;
  
  await actions.createSite({
    name: projectName,
    description: `Описание для ${projectName}`,
    status: 'draft'  // ❌ ПРОБЛЕМА: status не передается в API
  });
  setShowCreateModal(false);
};
```

**Проблемы:**
- ❌ `status: 'draft'` не передается в Sites API
- ❌ Нет обработки ошибок
- ❌ Нет редиректа после создания
- ❌ Нет обновления списка проектов

### **2. Проблема с редактированием проектов**

**Место:** `src/components/ProjectWorkspace.tsx`
```typescript
const handleEditPage = (pageId: string) => {
  // ❌ ПРОБЛЕМА: Функция не реализована
  console.log('Edit page:', pageId);
};
```

**Проблемы:**
- ❌ Функция `handleEditPage` не реализована
- ❌ Нет перехода в редактор
- ❌ Нет загрузки контента страницы

### **3. Проблема с демо проектом "Стартапус"**

**Место:** `prisma/seed.ts`
```typescript
const startapusProject = await prisma.project.upsert({
  where: { id: 'startapus-ecosystem' },
  update: {},
  create: {
    id: 'startapus-ecosystem',
    name: 'Сайт экосистемы Стартапус',
    // ... создается в БД
  }
});
```

**Проблемы:**
- ❌ Проект создается в БД, но не отображается в UI
- ❌ Нет связи с текущим пользователем
- ❌ Нет загрузки в SiteContext

## 🛠️ Решения

### **1. Исправить создание проектов**

```typescript
// src/pages/ProjectSelector.tsx
const handleCreateProject = async () => {
  try {
    const projectName = `Новый ${selectedProjectType === 'website' ? 'сайт' : 
      selectedProjectType === 'ecommerce' ? 'магазин' : 
      selectedProjectType === 'landing' ? 'лендинг' : 'блог'}`;
    
    const newSite = await actions.createSite({
      name: projectName,
      description: `Описание для ${projectName}`,
      template: selectedProjectType,
      settings: {
        theme: 'auto',
        primaryColor: '#3B82F6'
      }
    });
    
    setShowCreateModal(false);
    
    // Переходим к новому проекту
    navigate(`/situs/project/${newSite.id}`);
  } catch (error) {
    console.error('Ошибка создания проекта:', error);
    // Показать уведомление об ошибке
  }
};
```

### **2. Исправить редактирование проектов**

```typescript
// src/components/ProjectWorkspace.tsx
const handleEditPage = (pageId: string) => {
  // Загружаем страницу
  loadPage(pageId);
  
  // Переходим в режим редактора
  setIsEditorMode(true);
};
```

### **3. Добавить демо проект "Стартапус"**

```typescript
// src/contexts/SiteContext.tsx
const loadSites = async () => {
  dispatch({ type: 'SET_LOADING', payload: true });
  try {
    const response = await sitesApi.getSites();
    
    // Добавляем демо проект если нет проектов
    if (response.sites.length === 0) {
      const demoSite = await sitesApi.createSite({
        name: 'Стартапус - Демо проект',
        description: 'Демонстрационный проект экосистемы Стартапус',
        template: 'website',
        settings: {
          theme: 'auto',
          primaryColor: '#3B82F6'
        }
      });
      
      dispatch({ type: 'SET_SITES', payload: [demoSite] });
    } else {
      dispatch({ type: 'SET_SITES', payload: response.sites });
    }
  } catch (error) {
    dispatch({ type: 'SET_ERROR', payload: error.message });
  }
};
```

## 🚀 План действий

### **Этап 1: Исправить создание проектов**
1. ✅ Обновить `handleCreateProject` в ProjectSelector
2. ✅ Добавить обработку ошибок
3. ✅ Добавить редирект после создания
4. ✅ Обновить список проектов

### **Этап 2: Исправить редактирование проектов**
1. ✅ Реализовать `handleEditPage`
2. ✅ Добавить загрузку контента страницы
3. ✅ Настроить переход в редактор
4. ✅ Добавить сохранение изменений

### **Этап 3: Добавить демо проект**
1. ✅ Создать демо проект "Стартапус"
2. ✅ Добавить демо страницы
3. ✅ Настроить отображение в UI
4. ✅ Добавить демо контент

### **Этап 4: Тестирование**
1. ✅ Протестировать создание проектов
2. ✅ Протестировать редактирование
3. ✅ Протестировать демо проект
4. ✅ Проверить все функции

## 📋 Результат

После выполнения всех этапов:
- ✅ **Создание проектов** будет работать
- ✅ **Редактирование проектов** будет работать  
- ✅ **Демо проект "Стартапус"** будет отображаться
- ✅ **Полная функциональность** платформы

---

**Статус:** 🔄 **В ПРОЦЕССЕ ИСПРАВЛЕНИЯ**  
**Приоритет:** 🔴 **ВЫСОКИЙ**  
**Сложность:** 🟡 **СРЕДНЯЯ** 