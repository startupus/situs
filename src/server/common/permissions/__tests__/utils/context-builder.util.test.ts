/**
 * Unit тесты для утилит построения контекста
 */

import {
  buildContextFromRequest,
  determineResourceType,
  determineAccessScope,
  getComponentFromPermission,
  validatePermissionContext,
  createSimpleContext,
  mergeContexts,
  requiresAdditionalData,
} from '../../utils/context-builder.util';

describe('ContextBuilderUtil', () => {
  describe('determineResourceType', () => {
    it('должен правильно определять тип ресурса', () => {
      expect(determineResourceType('project.edit.own')).toBe('project');
      expect(determineResourceType('account.manage.members')).toBe('account');
      expect(determineResourceType('user.view.clients')).toBe('component');
      expect(determineResourceType('agency.clients.create')).toBe('agency');
      expect(determineResourceType('system.admin')).toBe('global');
      expect(determineResourceType('unknown.permission' as any)).toBe('global');
    });
  });

  describe('determineAccessScope', () => {
    it('должен правильно определять скоуп доступа', () => {
      expect(determineAccessScope('project.view.all')).toBe('global');
      expect(determineAccessScope('user.edit.clients')).toBe('agency');
      expect(determineAccessScope('project.edit.own')).toBe('own');
      expect(determineAccessScope('system.config')).toBe('platform');
      expect(determineAccessScope('orders.create')).toBe('own');
    });
  });

  describe('getComponentFromPermission', () => {
    it('должен правильно определять компонент', () => {
      expect(getComponentFromPermission('orders.view.own')).toBe('orders');
      expect(getComponentFromPermission('analytics.export.clients')).toBe('analytics');
      expect(getComponentFromPermission('billing.manage.all')).toBe('billing');
      expect(getComponentFromPermission('user.create.clients')).toBe('users');
      expect(getComponentFromPermission('project.edit.own')).toBe('projects');
      expect(getComponentFromPermission('system.admin')).toBeUndefined();
    });
  });

  describe('buildContextFromRequest', () => {
    it('должен строить контекст из HTTP запроса', () => {
      const mockRequest = {
        params: { id: 'project-123', projectId: 'project-123' },
        query: { accountId: 'account-456' },
        user: { id: 'user-789' },
      };

      const context = buildContextFromRequest('project.edit.own', mockRequest);

      expect(context.resource).toBe('project');
      expect(context.scope).toBe('own');
      expect(context.action).toBe('project.edit.own');
      expect(context.projectId).toBe('project-123');
      expect(context.accountId).toBe('account-456');
      expect(context.resourceId).toBe('project-123');
      expect(context.component).toBe('projects');
    });
  });

  describe('validatePermissionContext', () => {
    it('должен валидировать корректный контекст', () => {
      const validContext = {
        resource: 'project' as const,
        scope: 'own' as const,
        action: 'project.edit.own' as const,
        projectId: 'project-123',
      };

      expect(validatePermissionContext(validContext)).toBe(true);
    });

    it('должен отклонять контекст без обязательных полей', () => {
      const invalidContext = {
        resource: 'project' as const,
        scope: 'own' as const,
        // Отсутствует action
      } as any;

      expect(validatePermissionContext(invalidContext)).toBe(false);
    });

    it('должен отклонять контекст проекта без projectId', () => {
      const invalidContext = {
        resource: 'project' as const,
        scope: 'own' as const,
        action: 'project.edit.own' as const,
        // Отсутствует projectId
      };

      expect(validatePermissionContext(invalidContext)).toBe(false);
    });

    it('должен принимать глобальный контекст без resourceId', () => {
      const validContext = {
        resource: 'project' as const,
        scope: 'global' as const,
        action: 'project.view.all' as const,
        // projectId не требуется для global scope
      };

      expect(validatePermissionContext(validContext)).toBe(true);
    });
  });

  describe('createSimpleContext', () => {
    it('должен создавать простой контекст', () => {
      const context = createSimpleContext('project.edit.own');

      expect(context.action).toBe('project.edit.own');
      expect(context.resource).toBe('project');
      expect(context.scope).toBe('own');
    });

    it('должен принимать кастомный скоуп', () => {
      const context = createSimpleContext('project.view.clients', 'agency');

      expect(context.scope).toBe('agency');
    });
  });

  describe('mergeContexts', () => {
    it('должен объединять контексты', () => {
      const baseContext = {
        resource: 'project' as const,
        scope: 'own' as const,
        action: 'project.edit.own' as const,
      };

      const override = {
        projectId: 'project-123',
        ownerId: 'user-456',
      };

      const merged = mergeContexts(baseContext, override);

      expect(merged.resource).toBe('project');
      expect(merged.scope).toBe('own');
      expect(merged.action).toBe('project.edit.own');
      expect(merged.projectId).toBe('project-123');
      expect(merged.ownerId).toBe('user-456');
    });
  });

  describe('requiresAdditionalData', () => {
    it('должен требовать ownerId для скоупа own', () => {
      const context = {
        resource: 'project' as const,
        scope: 'own' as const,
        action: 'project.edit.own' as const,
        // Отсутствует ownerId
      };

      expect(requiresAdditionalData(context)).toBe(true);
    });

    it('должен требовать agencyId для скоупа agency', () => {
      const context = {
        resource: 'agency' as const,
        scope: 'agency' as const,
        action: 'agency.clients.manage' as const,
        // Отсутствуют agencyId и clientId
      };

      expect(requiresAdditionalData(context)).toBe(true);
    });

    it('должен требовать projectId для ресурса project', () => {
      const context = {
        resource: 'project' as const,
        scope: 'own' as const,
        action: 'project.edit.own' as const,
        ownerId: 'user-123',
        // Отсутствует projectId
      };

      expect(requiresAdditionalData(context)).toBe(true);
    });

    it('не должен требовать дополнительных данных для глобального скоупа', () => {
      const context = {
        resource: 'project' as const,
        scope: 'global' as const,
        action: 'project.view.all' as const,
      };

      expect(requiresAdditionalData(context)).toBe(false);
    });
  });
});
