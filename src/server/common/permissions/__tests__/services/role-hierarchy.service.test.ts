/**
 * Unit тесты для сервиса иерархии ролей
 */

import { Test, TestingModule } from '@nestjs/testing';
import { RoleHierarchyService } from '../../services/role-hierarchy.service';

// Mock конфигурации ролей
jest.mock('../../config/roles.config', () => ({
  ROLE_HIERARCHY: {
    SUPER_ADMIN: {
      id: 'SUPER_ADMIN',
      name: 'Супер администратор',
      level: 100,
      permissions: ['*']
    },
    STAFF: {
      id: 'STAFF',
      name: 'Персонал',
      level: 80,
      inheritsFrom: 'BUSINESS',
      permissions: ['system.admin', 'user.view.all']
    },
    AGENCY: {
      id: 'AGENCY',
      name: 'Агентство',
      level: 60,
      inheritsFrom: 'BUSINESS',
      permissions: ['agency.clients.manage', 'project.view.clients']
    },
    BUSINESS: {
      id: 'BUSINESS',
      name: 'Бизнес-пользователь',
      level: 40,
      permissions: ['project.edit.own', 'user.view.own']
    }
  }
}));

describe('RoleHierarchyService', () => {
  let service: RoleHierarchyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleHierarchyService],
    }).compile();

    service = module.get<RoleHierarchyService>(RoleHierarchyService);
  });

  describe('getRolePermissions', () => {
    it('должен возвращать все права для SUPER_ADMIN', () => {
      const permissions = service.getRolePermissions('SUPER_ADMIN');
      expect(permissions).toEqual(['*']);
    });

    it('должен возвращать права с наследованием для STAFF', () => {
      const permissions = service.getRolePermissions('STAFF');
      expect(permissions).toContain('system.admin');
      expect(permissions).toContain('user.view.all');
      expect(permissions).toContain('project.edit.own'); // Наследуется от BUSINESS
      expect(permissions).toContain('user.view.own'); // Наследуется от BUSINESS
    });

    it('должен возвращать права с наследованием для AGENCY', () => {
      const permissions = service.getRolePermissions('AGENCY');
      expect(permissions).toContain('agency.clients.manage');
      expect(permissions).toContain('project.view.clients');
      expect(permissions).toContain('project.edit.own'); // Наследуется от BUSINESS
      expect(permissions).toContain('user.view.own'); // Наследуется от BUSINESS
    });

    it('должен возвращать базовые права для BUSINESS', () => {
      const permissions = service.getRolePermissions('BUSINESS');
      expect(permissions).toContain('project.edit.own');
      expect(permissions).toContain('user.view.own');
      expect(permissions).not.toContain('agency.clients.manage');
    });

    it('должен возвращать пустой массив для несуществующей роли', () => {
      const permissions = service.getRolePermissions('UNKNOWN' as any);
      expect(permissions).toEqual([]);
    });
  });

  describe('hasPermission', () => {
    it('должен возвращать true для SUPER_ADMIN с любым правом', () => {
      expect(service.hasPermission('SUPER_ADMIN', 'project.edit.own')).toBe(true);
      expect(service.hasPermission('SUPER_ADMIN', 'system.admin')).toBe(true);
      expect(service.hasPermission('SUPER_ADMIN', 'unknown.permission' as any)).toBe(true);
    });

    it('должен проверять прямые права роли', () => {
      expect(service.hasPermission('BUSINESS', 'project.edit.own')).toBe(true);
      expect(service.hasPermission('BUSINESS', 'user.view.own')).toBe(true);
      expect(service.hasPermission('BUSINESS', 'system.admin')).toBe(false);
    });

    it('должен проверять наследуемые права', () => {
      expect(service.hasPermission('AGENCY', 'project.edit.own')).toBe(true); // Наследуется от BUSINESS
      expect(service.hasPermission('STAFF', 'user.view.own')).toBe(true); // Наследуется от BUSINESS
    });

    it('должен возвращать false для прав, которых нет у роли', () => {
      expect(service.hasPermission('BUSINESS', 'agency.clients.manage')).toBe(false);
      expect(service.hasPermission('BUSINESS', 'system.admin')).toBe(false);
    });
  });

  describe('getRoleInfo', () => {
    it('должен возвращать информацию о роли', () => {
      const roleInfo = service.getRoleInfo('AGENCY');
      
      expect(roleInfo).toBeDefined();
      expect(roleInfo?.id).toBe('AGENCY');
      expect(roleInfo?.name).toBe('Агентство');
      expect(roleInfo?.level).toBe(60);
      expect(roleInfo?.inheritsFrom).toBe('BUSINESS');
    });

    it('должен возвращать null для несуществующей роли', () => {
      const roleInfo = service.getRoleInfo('UNKNOWN' as any);
      expect(roleInfo).toBeNull();
    });
  });

  describe('getAllRoles', () => {
    it('должен возвращать все роли', () => {
      const roles = service.getAllRoles();
      
      expect(roles).toHaveLength(4);
      expect(roles.map(r => r.id)).toContain('SUPER_ADMIN');
      expect(roles.map(r => r.id)).toContain('STAFF');
      expect(roles.map(r => r.id)).toContain('AGENCY');
      expect(roles.map(r => r.id)).toContain('BUSINESS');
    });
  });

  describe('canManageRole', () => {
    it('должен позволять высшим ролям управлять низшими', () => {
      expect(service.canManageRole('SUPER_ADMIN', 'STAFF')).toBe(true);
      expect(service.canManageRole('STAFF', 'AGENCY')).toBe(true);
      expect(service.canManageRole('AGENCY', 'BUSINESS')).toBe(true);
    });

    it('не должен позволять низшим ролям управлять высшими', () => {
      expect(service.canManageRole('BUSINESS', 'AGENCY')).toBe(false);
      expect(service.canManageRole('AGENCY', 'STAFF')).toBe(false);
    });
  });

  describe('getManageableRoles', () => {
    it('должен возвращать управляемые роли', () => {
      const staffManageable = service.getManageableRoles('STAFF');
      expect(staffManageable).toContain('AGENCY');
      expect(staffManageable).toContain('BUSINESS');
      expect(staffManageable).not.toContain('STAFF');

      const agencyManageable = service.getManageableRoles('AGENCY');
      expect(agencyManageable).toContain('BUSINESS');
      expect(agencyManageable).not.toContain('AGENCY');
    });
  });

  describe('checkRoleLimitations', () => {
    it('должен проверять лимиты роли', async () => {
      const result = await service.checkRoleLimitations('BUSINESS', {
        projectsCount: 10,
        clientsCount: 5,
        storageUsed: 15000
      });

      // Проверяем, что метод работает (конкретные лимиты зависят от конфига)
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('violations');
      expect(Array.isArray(result.violations)).toBe(true);
    });
  });
});