import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '**/*.d.ts',
    ],
    testTimeout: 30000,
    hookTimeout: 30000,
    // Конфигурация для предотвращения зависающих тестов
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    // Принудительное завершение после timeout
    teardownTimeout: 10000,
    // Отключаем watch mode для стабильности
    watch: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        '**/*.test.ts',
        '**/*.spec.ts'
      ],
      thresholds: {
        global: {
          branches: 60,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    }
  }
});
