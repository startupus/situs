import { vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

/**
 * Global Test Setup
 * Конфигурация тестового окружения для всех тестов
 */

// Extend expect with custom matchers
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// Extend global types
declare global {
  namespace Vi {
    interface AsymmetricMatchersContaining {
      toBeWithinRange(floor: number, ceiling: number): any;
    }
  }
}

// Setup DOM environment
import 'jsdom';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
})) as any;

// Mock ResizeObserver
global.ResizeObserver = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
})) as any;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock fetch for API tests
global.fetch = vi.fn();

// Mock console methods for cleaner test output
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  // Suppress console.error for known React warnings in tests
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Warning: An invalid form control'))
    ) {
      return;
    }
    originalConsoleError.call(console, ...args);
  };

  // Suppress console.warn for known warnings
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('componentWillReceiveProps has been renamed')
    ) {
      return;
    }
    originalConsoleWarn.call(console, ...args);
  };
});

afterAll(() => {
  // Restore console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Cleanup after each test
afterEach(() => {
  // Cleanup DOM
  cleanup();
  
  // Clear all mocks
  vi.clearAllMocks();
  
  // Clear timers
  vi.clearAllTimers();
  
  // Clear localStorage
  localStorageMock.clear();
  
  // Clear sessionStorage
  sessionStorageMock.clear();
  
  // Reset fetch mock
  vi.mocked(fetch).mockReset();
});

// Environment variables for tests
process.env.NODE_ENV = 'test';
process.env.VITE_API_URL = 'http://localhost:3001';

// Test utilities
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'user',
  isActive: true,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockProject = (overrides = {}) => ({
  id: '1',
  name: 'Test Project',
  slug: 'test-project',
  description: 'Test project description',
  status: 'active',
  isPublished: true,
  createdAt: new Date().toISOString(),
  ...overrides,
});

export const createMockApiResponse = <T>(data: T, success = true) => ({
  success,
  data: success ? data : null,
  error: success ? null : { message: 'Test error' },
  timestamp: new Date().toISOString(),
});

// Test helpers for async operations
export const waitFor = (condition: () => boolean, timeout = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - startTime >= timeout) {
        reject(new Error(`Condition not met within ${timeout}ms`));
      } else {
        setTimeout(check, 10);
      }
    };
    check();
  });
};

// Performance testing helpers
export const measurePerformance = async (fn: () => Promise<any> | any): Promise<number> => {
  const start = performance.now();
  await fn();
  return performance.now() - start;
};

// Memory testing helpers
export const getMemoryUsage = () => {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    return process.memoryUsage();
  }
  // Browser fallback
  return {
    rss: 0,
    heapTotal: (performance as any).memory?.totalJSHeapSize || 0,
    heapUsed: (performance as any).memory?.usedJSHeapSize || 0,
    external: 0,
    arrayBuffers: 0,
  };
};

// Network mocking helpers
export const mockNetworkError = () => {
  vi.mocked(fetch).mockRejectedValue(new Error('Network Error'));
};

export const mockApiSuccess = <T>(data: T) => {
  vi.mocked(fetch).mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(createMockApiResponse(data)),
  } as Response);
};

export const mockApiError = (status = 500, message = 'Server Error') => {
  vi.mocked(fetch).mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve(createMockApiResponse(null, false)),
  } as Response);
};

// Security testing helpers
export const generateXSSPayload = () => '<script>alert("XSS")</script>';
export const generateSQLInjectionPayload = () => "'; DROP TABLE users; --";
export const generateLongString = (length = 10000) => 'x'.repeat(length);

// Accessibility testing setup
import 'jest-axe/extend-expect';

// React Testing Library custom render
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { BrowserRouter } from 'react-router-dom';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
};

export const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Export test categories for better organization
export const TEST_CATEGORIES = {
  UNIT: 'unit',
  INTEGRATION: 'integration',
  E2E: 'e2e',
  PERFORMANCE: 'performance',
  SECURITY: 'security',
  ACCESSIBILITY: 'accessibility',
} as const;