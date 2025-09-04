import React, { useState, useEffect, useCallback, useContext, createContext, ReactNode } from 'react';
import { TenantContext as TenantContextType } from '../types/tenant/tenant-context.types';
import { TenantMetrics, TenantAlert } from '../types/tenant/tenant-monitoring.types';

interface TenantContextValue {
  tenantContext: TenantContextType | null;
  metrics: TenantMetrics | null;
  alerts: TenantAlert[];
  health: {
    status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    score: number;
    message: string;
  } | null;
  loading: boolean;
  error: string | null;
  refreshMetrics: () => Promise<void>;
  refreshAlerts: () => Promise<void>;
  resolveAlert: (alertId: string) => Promise<void>;
  refreshHealth: () => Promise<void>;
}

const TenantContext = createContext<TenantContextValue | null>(null);

interface TenantProviderProps {
  children: ReactNode;
  initialTenantId?: string;
}

export function TenantProvider({ children, initialTenantId }: TenantProviderProps) {
  const [tenantContext, setTenantContext] = useState<TenantContextType | null>(null);
  const [metrics, setMetrics] = useState<TenantMetrics | null>(null);
  const [alerts, setAlerts] = useState<TenantAlert[]>([]);
  const [health, setHealth] = useState<{
    status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    score: number;
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize tenant context
  useEffect(() => {
    const initializeTenant = async () => {
      if (initialTenantId) {
        setTenantContext({ tenantId: initialTenantId });
        await Promise.all([refreshMetrics(), refreshAlerts(), refreshHealth()]);
      } else {
        // Try to get tenant from subdomain, header, or localStorage
        const tenantId = getTenantFromEnvironment();
        if (tenantId) {
          setTenantContext({ tenantId });
          await Promise.all([refreshMetrics(), refreshAlerts(), refreshHealth()]);
        }
      }
    };

    initializeTenant();
  }, [initialTenantId]);

  // Auto-refresh metrics every 5 minutes
  useEffect(() => {
    if (!tenantContext) return;

    const interval = setInterval(
      () => {
        refreshMetrics();
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(interval);
  }, [tenantContext]);

  // Auto-refresh alerts every minute
  useEffect(() => {
    if (!tenantContext) return;

    const interval = setInterval(() => {
      refreshAlerts();
    }, 60 * 1000); // 1 minute

    return () => clearInterval(interval);
  }, [tenantContext]);

  const getTenantFromEnvironment = (): string | null => {
    // Check subdomain
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
      return subdomain;
    }

    // Check localStorage
    const storedTenant = localStorage.getItem('tenantId');
    if (storedTenant) {
      return storedTenant;
    }

    // Check URL path
    const pathMatch = window.location.pathname.match(/^\/tenant\/([^\/]+)/);
    if (pathMatch) {
      return pathMatch[1];
    }

    return null;
  };

  const refreshMetrics = useCallback(async () => {
    if (!tenantContext) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/monitoring/metrics', {
        headers: {
          'X-Tenant-ID': tenantContext.tenantId,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch metrics: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setMetrics(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch metrics');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Failed to refresh metrics:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [tenantContext]);

  const refreshAlerts = useCallback(async () => {
    if (!tenantContext) return;

    try {
      const response = await fetch('/api/monitoring/alerts', {
        headers: {
          'X-Tenant-ID': tenantContext.tenantId,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch alerts: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setAlerts(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch alerts');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to refresh alerts:', errorMessage);
    }
  }, [tenantContext]);

  const refreshHealth = useCallback(async () => {
    if (!tenantContext) return;

    try {
      const response = await fetch('/api/monitoring/health', {
        headers: {
          'X-Tenant-ID': tenantContext.tenantId,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch health: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setHealth(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch health');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to refresh health:', errorMessage);
    }
  }, [tenantContext]);

  const resolveAlert = useCallback(
    async (alertId: string) => {
      if (!tenantContext) return;

      try {
        const response = await fetch(`/api/monitoring/alerts/${alertId}/resolve`, {
          method: 'POST',
          headers: {
            'X-Tenant-ID': tenantContext.tenantId,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to resolve alert: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.success) {
          // Remove resolved alert from local state
          setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
        } else {
          throw new Error(result.message || 'Failed to resolve alert');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Failed to resolve alert:', errorMessage);
        throw err;
      }
    },
    [tenantContext],
  );

  const value: TenantContextValue = {
    tenantContext,
    metrics,
    alerts,
    health,
    loading,
    error,
    refreshMetrics,
    refreshAlerts,
    resolveAlert,
    refreshHealth,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenantContext(): TenantContextValue {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
}

// Convenience hooks for specific data
export function useTenantMetrics() {
  const { metrics, refreshMetrics, loading, error } = useTenantContext();
  return { metrics, refreshMetrics, loading, error };
}

export function useTenantAlerts() {
  const { alerts, refreshAlerts, resolveAlert } = useTenantContext();
  return { alerts, refreshAlerts, resolveAlert };
}

export function useTenantHealth() {
  const { health, refreshHealth } = useTenantContext();
  return { health, refreshHealth };
}

export function useTenantId(): string | null {
  const { tenantContext } = useTenantContext();
  return tenantContext?.tenantId || null;
}
