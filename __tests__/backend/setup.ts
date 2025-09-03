// Backend test setup: минимальные env, без глобальных моков Prisma
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.AUTH_TEST_TOKEN = process.env.AUTH_TEST_TOKEN || 'test-token-12345';

// Здесь осознанно НЕ мокаем '@prisma/client', чтобы enums (ProjectStatus и др.) были доступны
