/**
 * Unit тесты для утилит работы с ролями
 */

import {
  getGlobalRoleLevel,
  getProjectRoleLevel,
  getAccountRoleLevel,
  canManageRole,
  hasMinimumRoleLevel,
  getManageableRoles,
  isAgencyRole,
  isAdminRole,
  getRoleDisplayName,
  getRoleDescription,
} from '../../utils/role-matcher.util';

describe('RoleMatcherUtil', () => {
  describe('getGlobalRoleLevel', () => {
    it('должен возвращать правильные уровни ролей', () => {
      expect(getGlobalRoleLevel('SUPER_ADMIN')).toBe(100);
      expect(getGlobalRoleLevel('STAFF')).toBe(80);
      expect(getGlobalRoleLevel('AGENCY')).toBe(60);
      expect(getGlobalRoleLevel('BUSINESS')).toBe(40);
    });
  });

  describe('getProjectRoleLevel', () => {
    it('должен возвращать правильные уровни ролей проекта', () => {
      expect(getProjectRoleLevel('OWNER')).toBe(100);
      expect(getProjectRoleLevel('ADMIN')).toBe(80);
      expect(getProjectRoleLevel('EDITOR')).toBe(60);
      expect(getProjectRoleLevel('VIEWER')).toBe(40);
    });
  });

  describe('getAccountRoleLevel', () => {
    it('должен возвращать правильные уровни ролей аккаунта', () => {
      expect(getAccountRoleLevel('OWNER')).toBe(100);
      expect(getAccountRoleLevel('ADMIN')).toBe(80);
      expect(getAccountRoleLevel('MANAGER')).toBe(60);
      expect(getAccountRoleLevel('MEMBER')).toBe(40);
    });
  });

  describe('canManageRole', () => {
    it('должен позволять высшим ролям управлять низшими', () => {
      expect(canManageRole('SUPER_ADMIN', 'STAFF')).toBe(true);
      expect(canManageRole('STAFF', 'AGENCY')).toBe(true);
      expect(canManageRole('AGENCY', 'BUSINESS')).toBe(true);
    });

    it('не должен позволять низшим ролям управлять высшими', () => {
      expect(canManageRole('BUSINESS', 'AGENCY')).toBe(false);
      expect(canManageRole('AGENCY', 'STAFF')).toBe(false);
      expect(canManageRole('STAFF', 'SUPER_ADMIN')).toBe(false);
    });

    it('не должен позволять равным ролям управлять друг другом', () => {
      expect(canManageRole('AGENCY', 'AGENCY')).toBe(false);
      expect(canManageRole('BUSINESS', 'BUSINESS')).toBe(false);
    });
  });

  describe('hasMinimumRoleLevel', () => {
    it('должен возвращать true для достаточного уровня', () => {
      expect(hasMinimumRoleLevel('SUPER_ADMIN', 'STAFF')).toBe(true);
      expect(hasMinimumRoleLevel('STAFF', 'AGENCY')).toBe(true);
      expect(hasMinimumRoleLevel('AGENCY', 'BUSINESS')).toBe(true);
    });

    it('должен возвращать true для равного уровня', () => {
      expect(hasMinimumRoleLevel('AGENCY', 'AGENCY')).toBe(true);
      expect(hasMinimumRoleLevel('BUSINESS', 'BUSINESS')).toBe(true);
    });

    it('должен возвращать false для недостаточного уровня', () => {
      expect(hasMinimumRoleLevel('BUSINESS', 'AGENCY')).toBe(false);
      expect(hasMinimumRoleLevel('AGENCY', 'STAFF')).toBe(false);
    });
  });

  describe('getManageableRoles', () => {
    it('должен возвращать роли, которыми может управлять SUPER_ADMIN', () => {
      const roles = getManageableRoles('SUPER_ADMIN');
      expect(roles).toContain('STAFF');
      expect(roles).toContain('AGENCY');
      expect(roles).toContain('BUSINESS');
      expect(roles).not.toContain('SUPER_ADMIN');
    });

    it('должен возвращать роли, которыми может управлять STAFF', () => {
      const roles = getManageableRoles('STAFF');
      expect(roles).toContain('AGENCY');
      expect(roles).toContain('BUSINESS');
      expect(roles).not.toContain('STAFF');
      expect(roles).not.toContain('SUPER_ADMIN');
    });

    it('должен возвращать роли, которыми может управлять AGENCY', () => {
      const roles = getManageableRoles('AGENCY');
      expect(roles).toContain('BUSINESS');
      expect(roles).not.toContain('AGENCY');
      expect(roles).not.toContain('STAFF');
    });

    it('должен возвращать пустой массив для BUSINESS', () => {
      const roles = getManageableRoles('BUSINESS');
      expect(roles).toEqual([]);
    });
  });

  describe('isAgencyRole', () => {
    it('должен возвращать true для агентских ролей', () => {
      expect(isAgencyRole('AGENCY')).toBe(true);
      expect(isAgencyRole('STAFF')).toBe(true);
      expect(isAgencyRole('SUPER_ADMIN')).toBe(true);
    });

    it('должен возвращать false для не-агентских ролей', () => {
      expect(isAgencyRole('BUSINESS')).toBe(false);
    });
  });

  describe('isAdminRole', () => {
    it('должен возвращать true для административных ролей', () => {
      expect(isAdminRole('STAFF')).toBe(true);
      expect(isAdminRole('SUPER_ADMIN')).toBe(true);
    });

    it('должен возвращать false для не-административных ролей', () => {
      expect(isAdminRole('AGENCY')).toBe(false);
      expect(isAdminRole('BUSINESS')).toBe(false);
    });
  });

  describe('getRoleDisplayName', () => {
    it('должен возвращать правильные названия ролей', () => {
      expect(getRoleDisplayName('SUPER_ADMIN')).toBe('Супер администратор');
      expect(getRoleDisplayName('STAFF')).toBe('Персонал');
      expect(getRoleDisplayName('AGENCY')).toBe('Агентство');
      expect(getRoleDisplayName('BUSINESS')).toBe('Бизнес-пользователь');
    });
  });

  describe('getRoleDescription', () => {
    it('должен возвращать правильные описания ролей', () => {
      expect(getRoleDescription('SUPER_ADMIN')).toContain('Полный контроль');
      expect(getRoleDescription('STAFF')).toContain('Системные администраторы');
      expect(getRoleDescription('AGENCY')).toContain('Агентство с клиентами');
      expect(getRoleDescription('BUSINESS')).toContain('Обычный пользователь');
    });
  });
});
