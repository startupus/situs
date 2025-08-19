/**
 * Интеграционные тесты для PermissionGuard
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionGuard } from '../../guards/permission.guard';
import { PermissionsService } from '../../services/permissions.service';

describe('PermissionGuard Integration', () => {
  let guard: PermissionGuard;
  let permissionsService: jest.Mocked<PermissionsService>;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    const mockPermissionsService = {
      checkPermission: jest.fn()
    };

    const mockReflector = {
      getAllAndOverride: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionGuard,
        { provide: PermissionsService, useValue: mockPermissionsService },
        { provide: Reflector, useValue: mockReflector },
      ],
    }).compile();

    guard = module.get<PermissionGuard>(PermissionGuard);
    permissionsService = module.get(PermissionsService);
    reflector = module.get(Reflector);
  });

  const createMockContext = (
    user: any = { id: 'user-123', globalRole: 'BUSINESS' },
    params: any = {},
    query: any = {},
    headers: any = {}
  ): ExecutionContext => {
    const request = {
      user,
      params,
      query,
      headers
    };

    return {
      switchToHttp: () => ({
        getRequest: () => request
      }),
      getHandler: jest.fn(),
      getClass: jest.fn()
    } as any;
  };

  describe('canActivate', () => {
    it('должен разрешать доступ в тестовом режиме', async () => {
      process.env.NODE_ENV = 'test';
      process.env.AUTH_TEST_TOKEN = 'test-token-12345';

      const context = createMockContext(
        { id: 'user-123' },
        {},
        {},
        { authorization: 'Bearer test-token-12345' }
      );

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('должен разрешать доступ без требований к правам', async () => {
      reflector.getAllAndOverride.mockReturnValue(undefined);

      const context = createMockContext();
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('должен запрещать доступ без пользователя', async () => {
      reflector.getAllAndOverride.mockReturnValue('project.edit.own');

      const context = createMockContext(null); // Нет пользователя
      const result = await guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('должен разрешать доступ для SUPER_ADMIN', async () => {
      reflector.getAllAndOverride.mockReturnValue('any.permission');

      const context = createMockContext({ id: 'admin', globalRole: 'SUPER_ADMIN' });
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('должен проверять одиночные права', async () => {
      reflector.getAllAndOverride.mockReturnValue('project.edit.own');
      permissionsService.checkPermission.mockResolvedValue({ allowed: true });

      const context = createMockContext(
        { id: 'user-123', globalRole: 'BUSINESS' },
        { projectId: 'project-123' }
      );

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(permissionsService.checkPermission).toHaveBeenCalled();
    });

    it('должен проверять множественные права (any)', async () => {
      reflector.getAllAndOverride.mockReturnValue({
        type: 'any',
        permissions: ['project.edit.own', 'project.edit.clients']
      });
      
      // Первое право не проходит, второе проходит
      permissionsService.checkPermission
        .mockResolvedValueOnce({ allowed: false })
        .mockResolvedValueOnce({ allowed: true });

      const context = createMockContext(
        { id: 'user-456', globalRole: 'AGENCY' },
        { projectId: 'project-123' }
      );

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(permissionsService.checkPermission).toHaveBeenCalledTimes(2);
    });

    it('должен проверять множественные права (all)', async () => {
      reflector.getAllAndOverride.mockReturnValue({
        type: 'all',
        permissions: ['project.view.own', 'project.edit.own']
      });
      
      // Оба права проходят
      permissionsService.checkPermission.mockResolvedValue({ allowed: true });

      const context = createMockContext(
        { id: 'user-123', globalRole: 'BUSINESS' },
        { projectId: 'project-123' }
      );

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(permissionsService.checkPermission).toHaveBeenCalledTimes(2);
    });

    it('должен запрещать доступ если не все права есть (all)', async () => {
      reflector.getAllAndOverride.mockReturnValue({
        type: 'all',
        permissions: ['project.view.own', 'project.delete.own']
      });
      
      // Первое право проходит, второе нет
      permissionsService.checkPermission
        .mockResolvedValueOnce({ allowed: true })
        .mockResolvedValueOnce({ allowed: false });

      const context = createMockContext(
        { id: 'user-123', globalRole: 'BUSINESS' },
        { projectId: 'project-123' }
      );

      const result = await guard.canActivate(context);

      expect(result).toBe(false);
    });

    it('должен проверять владение ресурсом', async () => {
      reflector.getAllAndOverride.mockReturnValue({
        type: 'owner',
        resourceType: 'project'
      });

      const context = createMockContext(
        { id: 'user-123', globalRole: 'BUSINESS' },
        { id: 'project-123' }
      );

      // Mock private method через прототип
      const checkOwnershipSpy = jest.spyOn(guard as any, 'checkOwnership')
        .mockResolvedValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('должен проверять агентский доступ', async () => {
      reflector.getAllAndOverride.mockReturnValue({
        type: 'agency',
        scope: 'clients'
      });

      const context = createMockContext(
        { id: 'user-456', globalRole: 'AGENCY' },
        {},
        { clientId: 'client-123' }
      );

      // Mock private method
      const checkAgencyAccessSpy = jest.spyOn(guard as any, 'checkAgencyAccess')
        .mockResolvedValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('должен запрещать агентский доступ не-агентствам', async () => {
      reflector.getAllAndOverride.mockReturnValue({
        type: 'agency',
        scope: 'clients'
      });

      const context = createMockContext(
        { id: 'user-123', globalRole: 'BUSINESS' }, // Не агентство
        {},
        { clientId: 'client-123' }
      );

      const result = await guard.canActivate(context);

      expect(result).toBe(false);
    });
  });

  describe('error handling', () => {
    it('должен обрабатывать ошибки сервиса', async () => {
      reflector.getAllAndOverride.mockReturnValue('project.edit.own');
      permissionsService.checkPermission.mockRejectedValue(new Error('Database error'));

      const context = createMockContext();
      const result = await guard.canActivate(context);

      expect(result).toBe(false);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.NODE_ENV;
    delete process.env.AUTH_TEST_TOKEN;
  });
});