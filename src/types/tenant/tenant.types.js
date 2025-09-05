'use strict';
/**
 * Core tenant type definitions
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.SubscriptionStatus = exports.TenantPermission = exports.TenantRole = exports.TenantStatus = void 0;
var TenantStatus;
(function (TenantStatus) {
  TenantStatus['ACTIVE'] = 'ACTIVE';
  TenantStatus['SUSPENDED'] = 'SUSPENDED';
  TenantStatus['ARCHIVED'] = 'ARCHIVED';
  TenantStatus['DELETED'] = 'DELETED';
})(TenantStatus || (exports.TenantStatus = TenantStatus = {}));
var TenantRole;
(function (TenantRole) {
  TenantRole['OWNER'] = 'OWNER';
  TenantRole['ADMIN'] = 'ADMIN';
  TenantRole['MANAGER'] = 'MANAGER';
  TenantRole['EDITOR'] = 'EDITOR';
  TenantRole['VIEWER'] = 'VIEWER';
})(TenantRole || (exports.TenantRole = TenantRole = {}));
var TenantPermission;
(function (TenantPermission) {
  // Project permissions
  TenantPermission['CREATE_PROJECT'] = 'CREATE_PROJECT';
  TenantPermission['EDIT_PROJECT'] = 'EDIT_PROJECT';
  TenantPermission['DELETE_PROJECT'] = 'DELETE_PROJECT';
  TenantPermission['VIEW_PROJECT'] = 'VIEW_PROJECT';
  // User permissions
  TenantPermission['INVITE_USERS'] = 'INVITE_USERS';
  TenantPermission['MANAGE_USERS'] = 'MANAGE_USERS';
  TenantPermission['VIEW_USERS'] = 'VIEW_USERS';
  // Settings permissions
  TenantPermission['MANAGE_SETTINGS'] = 'MANAGE_SETTINGS';
  TenantPermission['VIEW_SETTINGS'] = 'VIEW_SETTINGS';
  // Billing permissions
  TenantPermission['MANAGE_BILLING'] = 'MANAGE_BILLING';
  TenantPermission['VIEW_BILLING'] = 'VIEW_BILLING';
})(TenantPermission || (exports.TenantPermission = TenantPermission = {}));
var SubscriptionStatus;
(function (SubscriptionStatus) {
  SubscriptionStatus['ACTIVE'] = 'ACTIVE';
  SubscriptionStatus['CANCELED'] = 'CANCELED';
  SubscriptionStatus['INCOMPLETE'] = 'INCOMPLETE';
  SubscriptionStatus['INCOMPLETE_EXPIRED'] = 'INCOMPLETE_EXPIRED';
  SubscriptionStatus['PAST_DUE'] = 'PAST_DUE';
  SubscriptionStatus['TRIALING'] = 'TRIALING';
  SubscriptionStatus['UNPAID'] = 'UNPAID';
})(SubscriptionStatus || (exports.SubscriptionStatus = SubscriptionStatus = {}));
