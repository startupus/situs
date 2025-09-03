#!/bin/bash

# Скрипт проверки использования PostgreSQL

echo "🔍 Проверка целостности базы данных..."

echo "📊 Проверяем подключение к PostgreSQL..."
psql -U situs -h localhost -p 5432 -d situs -c "SELECT NOW();" >/dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "❌ Не удалось подключиться к PostgreSQL (situs@localhost:5432/situs)"
  echo "   Проверьте переменные окружения и доступность БД"
  exit 1
fi

echo "📈 Статистика данных:"
psql -U situs -h localhost -p 5432 -d situs -c "
  SELECT 'Проекты: ' || COUNT(*) FROM projects;
  SELECT 'Типы меню: ' || COUNT(*) FROM menu_types;
  SELECT 'Пункты меню: ' || COUNT(*) FROM menu_items;
  SELECT 'Продукты: ' || COUNT(*) FROM products;
  SELECT 'Страницы: ' || COUNT(*) FROM pages;
"

echo "✅ Проверка PostgreSQL завершена успешно"
exit 0
