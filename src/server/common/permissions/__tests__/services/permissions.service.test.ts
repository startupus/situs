/**
 * Unit тесты для основного сервиса прав доступа
 */

import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from '../../services/permissions.service';
import { RoleHierarchyService } from '../../services/role-hierarchy.service';
import { ContextResolverService } from '../../services/context-resolver.service';
import { PrismaService } from '../../../../database/prisma.service';

// Mock данные пользователя
const mockUser = {
  id: 'user-123',
  globalRole: 'BUSINESS',
  status: 'ACTIVE',
};

const mockAgencyUser = {
  id: 'user-456',
  globalRole: 'AGENCY',
  status: 'ACTIVE',
};

const mockSuperAdmin = {
  id: 'user-789',
  globalRole: 'SUPER_ADMIN',
  status: 'ACTIVE',
};

describe('PermissionsService', () => {
  let service: PermissionsService;
  let prismaService: jest.Mocked<PrismaService>;
  let roleHierarchyService: jest.Mocked<RoleHierarchyService>;
  let contextResolverService: jest.Mocked<ContextResolverService>;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
      },
    };

    const mockRoleHierarchyService = {
      hasPermission: jest.fn(),
      getRolePermissions: jest.fn(),
    };

    const mockContextResolverService = {
      checkProjectOwnership: jest.fn(),
      checkProjectAccess: jest.fn(),
      isAgencyClient: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RoleHierarchyService, useValue: mockRoleHierarchyService },
        { provide: ContextResolverService, useValue: mockContextResolverService },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    prismaService = module.get(PrismaService);
    roleHierarchyService = module.get(RoleHierarchyService);
    contextResolverService = module.get(ContextResolverService);
  });

  describe('checkPermission', () => {
    it('должен разрешать доступ для SUPER_ADMIN', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockSuperAdmin);

      const result = await service.checkPermission('user-789', {
        resource: 'project',
        scope: 'own',
        action: 'project.edit.own',
      });

      expect(result.allowed).toBe(true);
    });

    it('должен запрещать доступ для несуществующего пользователя', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.checkPermission('nonexistent', {
        resource: 'project',
        scope: 'own',
        action: 'project.edit.own',
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Пользователь не найден');
    });

    it('должен проверять базовые права роли', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      roleHierarchyService.hasPermission.mockReturnValue(false);

      const result = await service.checkPermission('user-123', {
        resource: 'project',
        scope: 'own',
        action: 'system.admin',
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('не имеет права');
      expect(roleHierarchyService.hasPermission).toHaveBeenCalledWith('BUSINESS', 'system.admin');
    });

    it('должен проверять контекстные права для собственных ресурсов', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      roleHierarchyService.hasPermission.mockReturnValue(true);
      contextResolverService.checkProjectOwnership.mockResolvedValue(true);

      const result = await service.checkPermission('user-123', {
        resource: 'project',
        scope: 'own',
        action: 'project.edit.own',
        projectId: 'project-123',
      });

      expect(result.allowed).toBe(true);
      expect(contextResolverService.checkProjectOwnership).toHaveBeenCalledWith('user-123', 'project-123');
    });

    it('должен запрещать доступ к чужим ресурсам', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      roleHierarchyService.hasPermission.mockReturnValue(true);
      contextResolverService.checkProjectOwnership.mockResolvedValue(false);
      contextResolverService.checkProjectAccess.mockResolvedValue({ hasAccess: false });

      const result = await service.checkPermission('user-123', {
        resource: 'project',
        scope: 'own',
        action: 'project.edit.own',
        projectId: 'project-456',
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Нет доступа к проекту');
    });

    it('должен проверять агентские права', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockAgencyUser);
      roleHierarchyService.hasPermission.mockReturnValue(true);
      contextResolverService.isAgencyClient.mockResolvedValue(true);

      const result = await service.checkPermission('user-456', {
        resource: 'agency',
        scope: 'agency',
        action: 'agency.clients.manage',
        clientId: 'client-123',
      });

      expect(result.allowed).toBe(true);
      expect(contextResolverService.isAgencyClient).toHaveBeenCalledWith('user-456', 'client-123');
    });

    it('должен запрещать агентские права не-агентствам', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser); // BUSINESS роль
      roleHierarchyService.hasPermission.mockReturnValue(true);

      const result = await service.checkPermission('user-123', {
        resource: 'agency',
        scope: 'agency',
        action: 'agency.clients.manage',
      });

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Агентские права доступны только агентствам');
    });

    it('должен обрабатывать ошибки валидации контекста', async () => {
      const result = await service.checkPermission('user-123', {
        resource: 'project',
        scope: 'own',
        // Отсутствует action
      } as any);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('Некорректный контекст проверки прав');
    });
  });

  describe('hasSimplePermission', () => {
    it('должен проверять простые права', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      roleHierarchyService.hasPermission.mockReturnValue(true);

      const result = await service.hasSimplePermission('user-123', 'project.edit.own');

      expect(result).toBe(true);
      expect(roleHierarchyService.hasPermission).toHaveBeenCalledWith('BUSINESS', 'project.edit.own');
    });

    it('должен возвращать false для несуществующего пользователя', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.hasSimplePermission('nonexistent', 'project.edit.own');

      expect(result).toBe(false);
    });

    it('должен возвращать true для SUPER_ADMIN', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockSuperAdmin);

      const result = await service.hasSimplePermission('user-789', 'any.permission' as any);

      expect(result).toBe(true);
    });
  });

  describe('getUserPermissions', () => {
    it('должен возвращать все права пользователя', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);
      roleHierarchyService.getRolePermissions.mockReturnValue(['project.edit.own', 'user.view.own']);

      const permissions = await service.getUserPermissions('user-123');

      expect(permissions).toEqual(['project.edit.own', 'user.view.own']);
      expect(roleHierarchyService.getRolePermissions).toHaveBeenCalledWith('BUSINESS');
    });

    it('должен возвращать пустой массив для несуществующего пользователя', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const permissions = await service.getUserPermissions('nonexistent');

      expect(permissions).toEqual([]);
    });
  });
});
