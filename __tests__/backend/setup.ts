// Backend test setup: минимальные env, без глобальных моков Prisma
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.AUTH_TEST_TOKEN = process.env.AUTH_TEST_TOKEN || 'test-token-12345';
process.env.TEST_PORT = process.env.TEST_PORT || '3003';
process.env.TEST_BASE = process.env.TEST_BASE || `http://localhost:${process.env.TEST_PORT}`;

// Здесь осознанно НЕ мокаем '@prisma/client', чтобы enums (ProjectStatus и др.) были доступны


