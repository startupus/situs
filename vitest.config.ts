import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['__tests__/backend/setup.ts'],
    include: ['__tests__/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage', '__tests__/security/**', 'src/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/api/__tests__/',
        'src/api/server.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**',
      ],
      include: ['src/api/**/*.ts'],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
