import { Injectable } from '@nestjs/common';
import type { Permission, GlobalRole, RoleInfo } from '../types';
import { 
  getGlobalRoleLevel, 
  canManageRole, 
  getManageableRoles 
} from '../utils';

/**
 * Сервис для работы с иерархией ролей
 * 
 * Отвечает за:
 * - Получение прав роли с учетом наследования
 * - Проверку иерархии ролей
 * - Валидацию прав ролей
 */
@Injectable()
export class RoleHierarchyService {
  
  /**
   * Получает все права роли с учетом наследования
   */
  getRolePermissions(roleId: GlobalRole): Permission[] {
    const { ROLE_HIERARCHY } = require('../config/roles.config');
    const role = ROLE_HIERARCHY[roleId];
    
    if (!role) return [];
    
    // Если есть специальное право "*", возвращаем все права
    if (role.permissions.includes('*')) {
      return ['*'] as Permission[];
    }
    
    let permissions = [...role.permissions];
    
    // Добавляем права от родительской роли
    if (role.inheritsFrom && ROLE_HIERARCHY[role.inheritsFrom]) {
      const parentPermissions = this.getRolePermissions(role.inheritsFrom);
      permissions = [...permissions, ...parentPermissions];
    }
    
    // Убираем дубликаты
    return [...new Set(permissions)];
  }

  /**
   * Проверяет, имеет ли роль определенное право
   */
  hasPermission(roleId: GlobalRole, permission: Permission): boolean {
    const permissions = this.getRolePermissions(roleId);
    
    // Если есть право "*", то все права разрешены
    if (permissions.includes('*' as Permission)) {
      return true;
    }
    
    return permissions.includes(permission);
  }

  /**
   * Получает информацию о роли
   */
  getRoleInfo(roleId: GlobalRole): RoleInfo | null {
    const { ROLE_HIERARCHY } = require('../config/roles.config');
    const role = ROLE_HIERARCHY[roleId];
    
    if (!role) return null;
    
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      level: role.level,
      inheritsFrom: role.inheritsFrom,
      limitations: role.limitations
    };
  }

  /**
   * Получает все доступные роли
   */
  getAllRoles(): RoleInfo[] {
    const { ROLE_HIERARCHY } = require('../config/roles.config');
    
    return Object.values(ROLE_HIERARCHY).map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      level: role.level,
      inheritsFrom: role.inheritsFrom,
      limitations: role.limitations
    }));
  }

  /**
   * Проверяет, может ли роль управлять другой ролью
   */
  canManageRole(managerRole: GlobalRole, targetRole: GlobalRole): boolean {
    return canManageRole(managerRole, targetRole);
  }

  /**
   * Получает роли, которыми может управлять данная роль
   */
  getManageableRoles(managerRole: GlobalRole): GlobalRole[] {
    return getManageableRoles(managerRole);
  }

  /**
   * Получает ограничения роли
   */
  getRoleLimitations(roleId: GlobalRole) {
    const roleInfo = this.getRoleInfo(roleId);
    return roleInfo?.limitations || {};
  }

  /**
   * Проверяет, превышает ли пользователь лимиты роли
   */
  async checkRoleLimitations(
    roleId: GlobalRole, 
    currentUsage: {
      projectsCount?: number;
      clientsCount?: number;
      storageUsed?: number;
    }
  ): Promise<{ valid: boolean; violations: string[] }> {
    const limitations = this.getRoleLimitations(roleId);
    const violations: string[] = [];

    if (limitations.maxProjects && limitations.maxProjects > 0) {
      if ((currentUsage.projectsCount || 0) > limitations.maxProjects) {
        violations.push(`Превышен лимит проектов: ${currentUsage.projectsCount}/${limitations.maxProjects}`);
      }
    }

    if (limitations.maxClients && limitations.maxClients > 0) {
      if ((currentUsage.clientsCount || 0) > limitations.maxClients) {
        violations.push(`Превышен лимит клиентов: ${currentUsage.clientsCount}/${limitations.maxClients}`);
      }
    }

    if (limitations.maxStorage && limitations.maxStorage > 0) {
      if ((currentUsage.storageUsed || 0) > limitations.maxStorage) {
        violations.push(`Превышен лимит хранилища: ${currentUsage.storageUsed}/${limitations.maxStorage} MB`);
      }
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }
}