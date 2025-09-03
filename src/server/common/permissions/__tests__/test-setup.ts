/**
 * Настройка тестового окружения для системы прав доступа
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../database/prisma.service';
import { DatabaseModule } from '../../../database/database.module';

/**
 * Создает тестовый модуль с базовыми зависимостями
 */
export async function createTestModule(providers: any[] = []): Promise<TestingModule> {
  return Test.createTestingModule({
    imports: [DatabaseModule],
    providers: [
      ...providers,
      // Mock PrismaService если не передан
      ...(providers.some((p) => p === PrismaService || p.provide === PrismaService)
        ? []
        : [{ provide: PrismaService, useValue: createMockPrismaService() }]),
    ],
  }).compile();
}

/**
 * Создает mock PrismaService для тестов
 */
export function createMockPrismaService() {
  return {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    },
    project: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    account: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    projectAccess: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    accountMembership: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    agencyClient: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    customAccessLevel: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
}

/**
 * Создает тестовые данные пользователей
 */
export const createTestUsers = () => ({
  superAdmin: {
    id: 'super-admin-test',
    email: 'superadmin@test.com',
    username: 'superadmin',
    globalRole: 'SUPER_ADMIN',
    status: 'ACTIVE',
  },
  staff: {
    id: 'staff-test',
    email: 'staff@test.com',
    username: 'staff',
    globalRole: 'STAFF',
    status: 'ACTIVE',
  },
  agency: {
    id: 'agency-test',
    email: 'agency@test.com',
    username: 'agency',
    globalRole: 'AGENCY',
    status: 'ACTIVE',
  },
  business: {
    id: 'business-test',
    email: 'business@test.com',
    username: 'business',
    globalRole: 'BUSINESS',
    status: 'ACTIVE',
  },
});

/**
 * Создает тестовые данные проектов
 */
export const createTestProjects = (ownerId: string) => ({
  project1: {
    id: `project-1-${ownerId}`,
    name: 'Test Project 1',
    slug: `test-project-1-${ownerId}`,
    ownerId,
    status: 'ACTIVE',
    isPublished: false,
  },
  project2: {
    id: `project-2-${ownerId}`,
    name: 'Test Project 2',
    slug: `test-project-2-${ownerId}`,
    ownerId,
    status: 'ACTIVE',
    isPublished: true,
  },
});

/**
 * Создает mock HTTP контекст для тестов
 */
export function createMockHttpContext(user: any = null, params: any = {}, query: any = {}, headers: any = {}) {
  const request = {
    user,
    params,
    query,
    headers,
  };

  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  };
}

/**
 * Матчеры для тестирования прав доступа
 */
export const permissionMatchers = {
  toHavePermission: (received: any, permission: string) => {
    const hasPermission = received.allowed === true;
    return {
      message: () => `expected ${received} ${hasPermission ? 'not ' : ''}to have permission ${permission}`,
      pass: hasPermission,
    };
  },

  toBePermissionDenied: (received: any, expectedReason?: string) => {
    const isDenied = received.allowed === false;
    const reasonMatches = !expectedReason || received.reason?.includes(expectedReason);

    return {
      message: () =>
        `expected ${received} to be permission denied${expectedReason ? ` with reason containing "${expectedReason}"` : ''}`,
      pass: isDenied && reasonMatches,
    };
  },
};

// Расширяем Jest матчеры
declare global {
  namespace jest {
    interface Matchers<R> {
      toHavePermission(permission: string): R;
      toBePermissionDenied(expectedReason?: string): R;
    }
  }
}

// Регистрируем кастомные матчеры
beforeAll(() => {
  expect.extend(permissionMatchers);
});
