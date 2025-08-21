/**
 * Unit тесты для утилит проверки прав доступа
 */

import {
  isOwnershipRequired,
  isClientAction,
  isGlobalAction,
  getRequiredRole,
  supportsClientScope,
  getPermissionCategory,
  isSystemPermission,
  getPermissionLevel
} from '../../utils/permission-checker.util';

describe('PermissionCheckerUtil', () => {
  describe('isOwnershipRequired', () => {
    it('должен возвращать true для прав с .own', () => {
      expect(isOwnershipRequired('project.edit.own')).toBe(true);
      expect(isOwnershipRequired('user.view.own')).toBe(true);
    });

    it('должен возвращать true для прав удаления', () => {
      expect(isOwnershipRequired('project.delete.clients')).toBe(true);
      expect(isOwnershipRequired('user.delete.all')).toBe(true);
    });

    it('должен возвращать true для прав редактирования', () => {
      expect(isOwnershipRequired('project.edit.clients')).toBe(true);
      expect(isOwnershipRequired('content.edit.all')).toBe(true);
    });

    it('должен возвращать false для прав просмотра без .own', () => {
      expect(isOwnershipRequired('project.view.all')).toBe(false);
      expect(isOwnershipRequired('analytics.view.clients')).toBe(false);
    });
  });

  describe('isClientAction', () => {
    it('должен возвращать true для прав с .clients', () => {
      expect(isClientAction('project.edit.clients')).toBe(true);
      expect(isClientAction('user.view.clients')).toBe(true);
    });

    it('должен возвращать true для прав с .all', () => {
      expect(isClientAction('project.view.all')).toBe(true);
      expect(isClientAction('user.delete.all')).toBe(true);
    });

    it('должен возвращать false для прав с .own', () => {
      expect(isClientAction('project.edit.own')).toBe(false);
      expect(isClientAction('user.view.own')).toBe(false);
    });
  });

  describe('isGlobalAction', () => {
    it('должен возвращать true для прав с .all', () => {
      expect(isGlobalAction('project.view.all')).toBe(true);
      expect(isGlobalAction('user.edit.all')).toBe(true);
    });

    it('должен возвращать true для системных прав', () => {
      expect(isGlobalAction('system.admin')).toBe(true);
      expect(isGlobalAction('system.config')).toBe(true);
    });

    it('должен возвращать true для core.admin', () => {
      expect(isGlobalAction('core.admin')).toBe(true);
    });

    it('должен возвращать false для обычных прав', () => {
      expect(isGlobalAction('project.edit.own')).toBe(false);
      expect(isGlobalAction('user.view.clients')).toBe(false);
    });
  });

  describe('getRequiredRole', () => {
    it('должен возвращать STAFF для глобальных действий', () => {
      expect(getRequiredRole('system.admin')).toBe('STAFF');
      expect(getRequiredRole('project.view.all')).toBe('STAFF');
    });

    it('должен возвращать AGENCY для клиентских действий', () => {
      expect(getRequiredRole('project.edit.clients')).toBe('AGENCY');
      expect(getRequiredRole('user.view.clients')).toBe('AGENCY');
    });

    it('должен возвращать BUSINESS для обычных действий', () => {
      expect(getRequiredRole('project.edit.own')).toBe('BUSINESS');
      expect(getRequiredRole('user.view.own')).toBe('BUSINESS');
    });
  });

  describe('supportsClientScope', () => {
    it('должен возвращать true для клиентских прав', () => {
      expect(supportsClientScope('project.view.clients')).toBe(true);
      expect(supportsClientScope('user.edit.clients')).toBe(true);
    });

    it('должен возвращать true для прав с .clients', () => {
      expect(supportsClientScope('orders.reports.clients')).toBe(true);
    });

    it('должен возвращать false для прав без клиентского скоупа', () => {
      expect(supportsClientScope('project.edit.own')).toBe(false);
      expect(supportsClientScope('system.admin')).toBe(false);
    });
  });

  describe('getPermissionCategory', () => {
    it('должен правильно определять категории', () => {
      expect(getPermissionCategory('project.edit.own')).toBe('projects');
      expect(getPermissionCategory('user.view.all')).toBe('users');
      expect(getPermissionCategory('orders.create')).toBe('orders');
      expect(getPermissionCategory('analytics.view.own')).toBe('analytics');
      expect(getPermissionCategory('billing.manage.clients')).toBe('billing');
      expect(getPermissionCategory('system.admin')).toBe('system');
      expect(getPermissionCategory('agency.clients.create')).toBe('agency');
      expect(getPermissionCategory('core.admin')).toBe('core');
    });

    it('должен возвращать unknown для неизвестных прав', () => {
      expect(getPermissionCategory('unknown.permission' as any)).toBe('unknown');
    });
  });

  describe('isSystemPermission', () => {
    it('должен возвращать true для системных прав', () => {
      expect(isSystemPermission('system.admin')).toBe(true);
      expect(isSystemPermission('system.config')).toBe(true);
      expect(isSystemPermission('core.admin')).toBe(true);
      expect(isSystemPermission('*' as any)).toBe(true);
    });

    it('должен возвращать false для обычных прав', () => {
      expect(isSystemPermission('project.edit.own')).toBe(false);
      expect(isSystemPermission('user.view.clients')).toBe(false);
    });
  });

  describe('getPermissionLevel', () => {
    it('должен возвращать правильные уровни важности', () => {
      expect(getPermissionLevel('*' as any)).toBe(1000);
      expect(getPermissionLevel('system.admin')).toBe(900);
      expect(getPermissionLevel('project.view.all')).toBe(800);
      expect(getPermissionLevel('user.edit.clients')).toBe(600);
      expect(getPermissionLevel('project.edit.own')).toBe(400);
      expect(getPermissionLevel('orders.create')).toBe(200);
    });
  });
});