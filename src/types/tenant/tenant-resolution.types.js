'use strict';
/**
 * Tenant resolution type definitions
 */
Object.defineProperty(exports, '__esModule', { value: true });
exports.TenantResolutionConfidence = exports.TenantResolutionMethod = void 0;
var TenantResolutionMethod;
(function (TenantResolutionMethod) {
  TenantResolutionMethod['SUBDOMAIN'] = 'subdomain';
  TenantResolutionMethod['HEADER'] = 'header';
  TenantResolutionMethod['PATH'] = 'path';
  TenantResolutionMethod['JWT'] = 'jwt';
  TenantResolutionMethod['DEFAULT'] = 'default';
})(TenantResolutionMethod || (exports.TenantResolutionMethod = TenantResolutionMethod = {}));
var TenantResolutionConfidence;
(function (TenantResolutionConfidence) {
  TenantResolutionConfidence['HIGH'] = 'high';
  TenantResolutionConfidence['MEDIUM'] = 'medium';
  TenantResolutionConfidence['LOW'] = 'low';
})(TenantResolutionConfidence || (exports.TenantResolutionConfidence = TenantResolutionConfidence = {}));
