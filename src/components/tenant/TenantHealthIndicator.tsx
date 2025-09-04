import React from 'react';
import { useTenantHealth } from '../../hooks/useTenantContext';
import { TenantHealthStatus } from '../../types/tenant/tenant-monitoring.types';

interface TenantHealthIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export function TenantHealthIndicator({ className = '', showDetails = true }: TenantHealthIndicatorProps) {
  const { health, refreshHealth } = useTenantHealth();

  if (!health) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-500">Checking health...</span>
      </div>
    );
  }

  const getStatusColor = (status: TenantHealthStatus): string => {
    switch (status) {
      case 'HEALTHY':
        return 'bg-green-500';
      case 'WARNING':
        return 'bg-yellow-500';
      case 'CRITICAL':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: TenantHealthStatus): JSX.Element => {
    switch (status) {
      case 'HEALTHY':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'WARNING':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case 'CRITICAL':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const getStatusText = (status: TenantHealthStatus): string => {
    switch (status) {
      case 'HEALTHY':
        return 'Healthy';
      case 'WARNING':
        return 'Warning';
      case 'CRITICAL':
        return 'Critical';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor(health.status)}`}></div>
        <span className="text-sm font-medium text-gray-900">{getStatusText(health.status)}</span>
        <span className="text-sm text-gray-500">({health.score}%)</span>
      </div>

      {showDetails && (
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">{health.message}</span>
          <button
            onClick={refreshHealth}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Refresh health status"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-center space-x-1">{getStatusIcon(health.status)}</div>
    </div>
  );
}

// Compact version for headers/navbars
export function TenantHealthBadge({ className = '' }: { className?: string }) {
  const { health } = useTenantHealth();

  if (!health) {
    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ${className}`}
      >
        <div className="w-2 h-2 bg-gray-300 rounded-full mr-1 animate-pulse"></div>
        Checking...
      </div>
    );
  }

  const getStatusColor = (status: TenantHealthStatus): string => {
    switch (status) {
      case 'HEALTHY':
        return 'bg-green-100 text-green-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(health.status)} ${className}`}
    >
      <div
        className={`w-2 h-2 rounded-full mr-1 ${
          health.status === 'HEALTHY'
            ? 'bg-green-500'
            : health.status === 'WARNING'
              ? 'bg-yellow-500'
              : health.status === 'CRITICAL'
                ? 'bg-red-500'
                : 'bg-gray-500'
        }`}
      ></div>
      {health.status} ({health.score}%)
    </div>
  );
}
