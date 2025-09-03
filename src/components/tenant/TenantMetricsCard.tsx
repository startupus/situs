import React from 'react';
import { useTenantMetrics } from '../../hooks/useTenantContext';
import { TenantMetrics } from '../../types/tenant/tenant-monitoring.types';

interface TenantMetricsCardProps {
  className?: string;
}

export function TenantMetricsCard({ className = '' }: TenantMetricsCardProps) {
  const { metrics, loading, error, refreshMetrics } = useTenantMetrics();

  if (loading && !metrics) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Metrics</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={refreshMetrics}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Metrics Available</h3>
          <p className="text-gray-500">Metrics will appear once tenant data is available.</p>
        </div>
      </div>
    );
  }

  const formatStorage = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Tenant Metrics</h3>
        <button
          onClick={refreshMetrics}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {metrics.activeUsers}
          </div>
          <div className="text-sm text-gray-500">Active Users</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {metrics.totalProjects}
          </div>
          <div className="text-sm text-gray-500">Projects</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {metrics.totalPages}
          </div>
          <div className="text-sm text-gray-500">Pages</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {formatStorage(metrics.storageUsed)}
          </div>
          <div className="text-sm text-gray-500">Storage Used</div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Health Score</div>
            <div className="text-2xl font-bold text-gray-900">{metrics.healthScore}%</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Last Activity</div>
            <div className="text-sm text-gray-900">{formatDate(metrics.lastActivity)}</div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                metrics.healthScore >= 80
                  ? 'bg-green-500'
                  : metrics.healthScore >= 50
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${metrics.healthScore}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
