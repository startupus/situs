#!/bin/bash

# Скрипт проверки целостности базы данных
# Убеждается что существует только одна база данных

echo "🔍 Проверка целостности базы данных..."

# Подсчет .db файлов в проекте
db_count=$(find . -name "*.db" -not -path "./node_modules/*" | wc -l | tr -d ' ')

echo "📊 Найдено баз данных: $db_count"

if [ $db_count -eq 0 ]; then
    echo "❌ ОШИБКА: База данных не найдена!"
    echo "   Ожидается: prisma/dev.db"
    exit 1
elif [ $db_count -eq 1 ]; then
    db_file=$(find . -name "*.db" -not -path "./node_modules/*")
    if [ "$db_file" = "./prisma/dev.db" ]; then
        echo "✅ База данных в порядке: $db_file"
        
        # Проверка данных
        echo "📈 Статистика данных:"
        sqlite3 prisma/dev.db "
        SELECT 'Проекты: ' || COUNT(*) FROM projects;
        SELECT 'Типы меню: ' || COUNT(*) FROM menu_types;
        SELECT 'Пункты меню: ' || COUNT(*) FROM menu_items;
        SELECT 'Продукты: ' || COUNT(*) FROM products;
        SELECT 'Страницы: ' || COUNT(*) FROM pages;
        "
        
        echo "✅ Проверка завершена успешно"
        exit 0
    else
        echo "❌ ОШИБКА: База данных в неправильном месте: $db_file"
        echo "   Ожидается: ./prisma/dev.db"
        exit 1
    fi
else
    echo "❌ ОШИБКА: Найдено $db_count баз данных. Должна быть только одна!"
    echo "   Найденные файлы:"
    find . -name "*.db" -not -path "./node_modules/*" | while read file; do
        echo "   - $file"
    done
    echo ""
    echo "🔧 Для исправления:"
    echo "   1. Определите какая база данных содержит актуальные данные"
    echo "   2. Скопируйте её в prisma/dev.db"
    echo "   3. Удалите все остальные .db файлы"
    echo "   4. Обновите DATABASE_URL в .env"
    exit 1
fi
