-- Инициализация базы данных Situs
-- Создание расширений для работы с UUID и полнотекстовым поиском

-- Расширения
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Создание пользователя администратора (будет создан через Prisma seed)
-- Здесь только базовая настройка БД

-- Настройка полнотекстового поиска для русского языка
CREATE TEXT SEARCH CONFIGURATION ru (COPY = russian);

-- Комментарии к таблицам (будут созданы через Prisma)
COMMENT ON DATABASE situs_db IS 'Situs Platform - Visual Website Builder Database'; 