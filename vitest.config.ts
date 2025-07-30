/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vitest Configuration
 * Enterprise-grade testing setup with comprehensive coverage
 */

export default defineConfig({
  plugins: [react()],
  test: {
    // Environment
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    
    // Global test configuration
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    
    // Test files patterns
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/api/__tests__/**/*.{test,spec}.{js,ts}'
    ],
    exclude: [
      'node_modules',
      'dist',
      'build',
      'coverage',
      '**/*.d.ts'
    ],
    
    // Timeouts
    testTimeout: 10000,      // 10s для обычных тестов
    hookTimeout: 10000,      // 10s для хуков
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      reportsDirectory: './coverage',
      
      // Coverage thresholds (enterprise standards)
      thresholds: {
        global: {
          branches: 80,
          functions: 85,
          lines: 85,
          statements: 85
        },
        // Более строгие требования для критичных модулей
        'src/api/services/': {
          branches: 90,
          functions: 95,
          lines: 95,
          statements: 95
        },
        'src/api/middleware/': {
          branches: 85,
          functions: 90,
          lines: 90,
          statements: 90
        }
      },
      
      // Files to include/exclude from coverage
      include: [
        'src/**/*.{js,ts,jsx,tsx}'
      ],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{js,ts,jsx,tsx}',
        'src/**/*.spec.{js,ts,jsx,tsx}',
        'src/test/**',
        'src/**/__tests__/**',
        'src/**/__mocks__/**',
        'src/components/ui/**', // UI компоненты могут иметь меньшее покрытие
        'src/**/index.ts',      // Файлы экспорта
        'src/**/*.stories.{js,ts,jsx,tsx}', // Storybook файлы
        'src/vite-env.d.ts'
      ]
    },
    
    // Reporter configuration
    reporter: [
      'verbose',
      'json',
      'html'
    ],
    outputFile: {
      json: './test-results/results.json',
      html: './test-results/report.html'
    },
    
    // Performance testing
    benchmark: {
      include: ['src/**/*.{bench,benchmark}.{js,ts}'],
      exclude: ['node_modules', 'dist']
    },
    
    // Workspace configuration for different test types
    workspace: [
      // Unit tests
      {
        test: {
          name: 'unit',
          include: [
            'src/**/*.test.{js,ts,jsx,tsx}',
            '!src/**/*.integration.test.{js,ts}',
            '!src/**/*.e2e.test.{js,ts}',
            '!src/**/*.performance.test.{js,ts}'
          ],
          environment: 'jsdom'
        }
      },
      // Integration tests
      {
        test: {
          name: 'integration',
          include: ['src/**/*.integration.test.{js,ts}'],
          environment: 'node',
          testTimeout: 30000 // Больше времени для интеграционных тестов
        }
      },
      // Performance tests
      {
        test: {
          name: 'performance',
          include: ['src/**/*.performance.test.{js,ts}'],
          environment: 'node',
          testTimeout: 60000, // Еще больше времени для тестов производительности
          minThreads: 1,
          maxThreads: 1 // Один поток для точных измерений производительности
        }
      },
      // Security tests
      {
        test: {
          name: 'security',
          include: ['src/**/security.test.{js,ts}'],
          environment: 'node',
          testTimeout: 20000
        }
      }
    ],
    
    // Threading
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 4,
        useAtomics: true
      }
    },
    
    // Watch mode configuration
    watch: {
      exclude: [
        'node_modules/**',
        'dist/**',
        'coverage/**',
        'test-results/**'
      ]
    },
    
    // Mock configuration
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    
    // Dependencies optimization
    deps: {
      inline: [
        // Inline certain dependencies for better performance
        '@prisma/client'
      ]
    }
  },
  
  // Resolve configuration for tests
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@test': path.resolve(__dirname, './src/test')
    }
  },
  
  // Define configuration for different environments
  define: {
    'import.meta.env.VITE_TEST_MODE': true
  }
});
