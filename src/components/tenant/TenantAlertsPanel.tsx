import React, { useState } from 'react';
import { useTenantAlerts } from '../../hooks/useTenantContext';
import { TenantAlert, TenantAlertSeverity } from '../../types/tenant/tenant-monitoring.types';

interface TenantAlertsPanelProps {
  className?: string;
  maxAlerts?: number;
}

export function TenantAlertsPanel({ className = '', maxAlerts = 10 }: TenantAlertsPanelProps) {
  const { alerts, refreshAlerts, resolveAlert } = useTenantAlerts();
  const [resolving, setResolving] = useState<string | null>(null);

  const handleResolveAlert = async (alertId: string) => {
    try {
      setResolving(alertId);
      await resolveAlert(alertId);
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    } finally {
      setResolving(null);
    }
  };

  const getSeverityColor = (severity: TenantAlertSeverity): string => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: TenantAlertSeverity): JSX.Element => {
    switch (severity) {
      case 'CRITICAL':
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
      case 'HIGH':
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
      case 'MEDIUM':
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
      case 'LOW':
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

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const activeAlerts = alerts.filter((alert) => !alert.resolved);
  const displayedAlerts = activeAlerts.slice(0, maxAlerts);

  if (activeAlerts.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center">
          <div className="text-green-500 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Good!</h3>
          <p className="text-gray-500">No active alerts at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Active Alerts</h3>
        <div className="flex items-center space-x-2">
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {activeAlerts.length} Active
          </span>
          <button
            onClick={refreshAlerts}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {displayedAlerts.map((alert) => (
          <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`p-1 rounded-full ${getSeverityColor(alert.severity)}`}>
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{alert.type}</span>
                  </div>
                  <p className="text-sm text-gray-900 mb-2">{alert.message}</p>
                  <p className="text-xs text-gray-500">{formatTimestamp(alert.timestamp)}</p>
                </div>
              </div>
              <button
                onClick={() => handleResolveAlert(alert.id)}
                disabled={resolving === alert.id}
                className="ml-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                {resolving === alert.id ? 'Resolving...' : 'Resolve'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeAlerts.length > maxAlerts && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Showing {maxAlerts} of {activeAlerts.length} alerts
          </p>
        </div>
      )}
    </div>
  );
}
