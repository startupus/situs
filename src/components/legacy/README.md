# Legacy Components

Эта папка содержит устаревшие компоненты, которые дублируют функциональность современной архитектуры.

## Перемещенные компоненты:

### RedaktusEditor.tsx
- **Замена:** `src/components/redaktus/redaktus-core.tsx`
- **Причина:** Дублирует функциональность полноценного Redaktus редактора

### StudioInterface.tsx  
- **Замена:** `src/components/situs/SitusApp.tsx`
- **Причина:** Конфликтует с Situs админ-панелью

### ProjectWorkspace.tsx
- **Замена:** `src/components/situs/pages/SitusProjects.tsx` 
- **Причина:** Дублирует управление проектами

### SitusPlatform.tsx
- **Замена:** `src/components/situs/SitusApp.tsx`
- **Причина:** Полностью дублирует Situs приложение

## Статус
Компоненты в этой папке НЕ используются в production коде, но сохранены для возможного восстановления функциональности при необходимости.

## Дата перемещения
30.07.2025 - Реструктуризация согласно TODO.md 