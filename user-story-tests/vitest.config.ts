import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./setup.ts'],
    testTimeout: 60000, // 60 секунд на тест
    hookTimeout: 30000, // 30 секунд на хуки
    pool: 'forks', // Изоляция тестов
    sequence: {
      shuffle: false // Сохраняем порядок тестов
    },
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'dist/**',
        '**/*.d.ts',
        'vitest.config.ts',
        'setup.ts'
      ]
    },
    // Настройки для параллельного выполнения
    poolOptions: {
      forks: {
        maxForks: 4,
        minForks: 1
      }
    },
    // Retry настройки для нестабильных тестов
    retry: 2,
    // Логирование
    logHeapUsage: true,
    // Отчеты
    reporters: [
      'default',
      'json',
      'html'
    ],
    outputFile: {
      json: './test-results/results.json',
      html: './test-results/report.html'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@helpers': path.resolve(__dirname, './helpers'),
      '@utils': path.resolve(__dirname, './utils')
    }
  }
});