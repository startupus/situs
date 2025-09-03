import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TenantAwarePrismaService } from '../tenant/tenant-aware-prisma.service';
import { TenantContextService } from '../tenant/tenant-context.service';

export interface TenantMetrics {
  tenantId: string;
  activeUsers: number;
  totalProjects: number;
  totalPages: number;
  storageUsed: number;
  lastActivity: Date;
  healthScore: number;
}

export interface TenantAlert {
  id: string;
  tenantId: string;
  type: 'PERFORMANCE' | 'STORAGE' | 'SECURITY' | 'BILLING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  timestamp: Date;
  resolved: boolean;
  metadata?: Record<string, any>;
}

@Injectable()
export class TenantMonitoringService {
  private readonly logger = new Logger(TenantMonitoringService.name);
  private readonly metricsCache = new Map<string, TenantMetrics>();
  private readonly alertsCache = new Map<string, TenantAlert[]>();

  constructor(
    private readonly prisma: TenantAwarePrismaService,
    private readonly tenantContextService: TenantContextService,
  ) {}

  /**
   * Collect metrics for all tenants
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async collectTenantMetrics(): Promise<void> {
    this.logger.log('Starting tenant metrics collection...');

    try {
      // Get all tenants (this would need a global context or admin service)
      const tenants = await this.getAllTenants();
      
      for (const tenant of tenants) {
        await this.collectMetricsForTenant(tenant.id);
      }

      this.logger.log(`Collected metrics for ${tenants.length} tenants`);
    } catch (error) {
      this.logger.error('Failed to collect tenant metrics', error);
    }
  }

  /**
   * Collect metrics for a specific tenant
   */
  async collectMetricsForTenant(tenantId: string): Promise<TenantMetrics> {
    try {
      // Set tenant context for this operation
      this.tenantContextService.setTenantContext({ tenantId });

      const [userCount, projectCount, pageCount] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.project.count(),
        this.prisma.page.count(),
      ]);

      // Calculate storage usage (simplified)
      const storageUsed = await this.calculateStorageUsage();

      // Get last activity
      const lastActivity = await this.getLastActivity();

      // Calculate health score
      const healthScore = this.calculateHealthScore({
        userCount,
        projectCount,
        pageCount,
        storageUsed,
        lastActivity,
      });

      const metrics: TenantMetrics = {
        tenantId,
        activeUsers: userCount,
        totalProjects: projectCount,
        totalPages: pageCount,
        storageUsed,
        lastActivity,
        healthScore,
      };

      this.metricsCache.set(tenantId, metrics);
      return metrics;
    } catch (error) {
      this.logger.error(`Failed to collect metrics for tenant ${tenantId}`, error);
      throw error;
    }
  }

  /**
   * Get metrics for current tenant
   */
  async getCurrentTenantMetrics(): Promise<TenantMetrics | null> {
    const tenantId = this.tenantContextService.getTenantId();
    if (!tenantId) {
      return null;
    }

    // Return cached metrics if available
    const cached = this.metricsCache.get(tenantId);
    if (cached) {
      return cached;
    }

    // Collect fresh metrics
    return this.collectMetricsForTenant(tenantId);
  }

  /**
   * Check for alerts and generate new ones
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async checkTenantAlerts(): Promise<void> {
    this.logger.log('Checking tenant alerts...');

    try {
      const tenants = await this.getAllTenants();
      
      for (const tenant of tenants) {
        await this.checkAlertsForTenant(tenant.id);
      }
    } catch (error) {
      this.logger.error('Failed to check tenant alerts', error);
    }
  }

  /**
   * Check alerts for a specific tenant
   */
  async checkAlertsForTenant(tenantId: string): Promise<void> {
    try {
      const metrics = await this.collectMetricsForTenant(tenantId);
      const alerts: TenantAlert[] = [];

      // Performance alerts
      if (metrics.healthScore < 50) {
        alerts.push({
          id: `perf-${tenantId}-${Date.now()}`,
          tenantId,
          type: 'PERFORMANCE',
          severity: metrics.healthScore < 20 ? 'CRITICAL' : 'HIGH',
          message: `Low health score: ${metrics.healthScore}%`,
          timestamp: new Date(),
          resolved: false,
          metadata: { healthScore: metrics.healthScore },
        });
      }

      // Storage alerts
      if (metrics.storageUsed > 1000000000) { // 1GB
        alerts.push({
          id: `storage-${tenantId}-${Date.now()}`,
          tenantId,
          type: 'STORAGE',
          severity: 'MEDIUM',
          message: `High storage usage: ${(metrics.storageUsed / 1024 / 1024).toFixed(2)}MB`,
          timestamp: new Date(),
          resolved: false,
          metadata: { storageUsed: metrics.storageUsed },
        });
      }

      // Security alerts (simplified)
      if (metrics.activeUsers > 100) {
        alerts.push({
          id: `security-${tenantId}-${Date.now()}`,
          tenantId,
          type: 'SECURITY',
          severity: 'LOW',
          message: `High user count: ${metrics.activeUsers} users`,
          timestamp: new Date(),
          resolved: false,
          metadata: { userCount: metrics.activeUsers },
        });
      }

      // Store alerts
      if (alerts.length > 0) {
        const existingAlerts = this.alertsCache.get(tenantId) || [];
        this.alertsCache.set(tenantId, [...existingAlerts, ...alerts]);
        
        // Log critical alerts
        const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL');
        if (criticalAlerts.length > 0) {
          this.logger.warn(`Critical alerts for tenant ${tenantId}:`, criticalAlerts);
        }
      }
    } catch (error) {
      this.logger.error(`Failed to check alerts for tenant ${tenantId}`, error);
    }
  }

  /**
   * Get alerts for current tenant
   */
  async getCurrentTenantAlerts(): Promise<TenantAlert[]> {
    const tenantId = this.tenantContextService.getTenantId();
    if (!tenantId) {
      return [];
    }

    return this.alertsCache.get(tenantId) || [];
  }

  /**
   * Resolve an alert
   */
  async resolveAlert(alertId: string): Promise<void> {
    const tenantId = this.tenantContextService.getTenantId();
    if (!tenantId) {
      throw new Error('No tenant context available');
    }

    const alerts = this.alertsCache.get(tenantId) || [];
    const alertIndex = alerts.findIndex(a => a.id === alertId);
    
    if (alertIndex !== -1) {
      alerts[alertIndex].resolved = true;
      this.alertsCache.set(tenantId, alerts);
      this.logger.log(`Resolved alert ${alertId} for tenant ${tenantId}`);
    }
  }

  /**
   * Get all tenants (simplified - would need proper admin service)
   */
  private async getAllTenants(): Promise<{ id: string }[]> {
    // This is a simplified implementation
    // In a real system, you'd have a proper tenant management service
    return [
      { id: 'tenant-1' },
      { id: 'tenant-2' },
      // Add more tenants as needed
    ];
  }

  /**
   * Calculate storage usage for current tenant
   */
  private async calculateStorageUsage(): Promise<number> {
    // Simplified storage calculation
    // In a real system, you'd calculate actual file sizes
    const pageCount = await this.prisma.page.count();
    return pageCount * 1024 * 100; // Assume 100KB per page
  }

  /**
   * Get last activity timestamp
   */
  private async getLastActivity(): Promise<Date> {
    // Get the most recent update from any table
    const [lastUserUpdate, lastProjectUpdate, lastPageUpdate] = await Promise.all([
      this.prisma.user.findFirst({ orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
      this.prisma.project.findFirst({ orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
      this.prisma.page.findFirst({ orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
    ]);

    const dates = [
      lastUserUpdate?.updatedAt,
      lastProjectUpdate?.updatedAt,
      lastPageUpdate?.updatedAt,
    ].filter(Boolean) as Date[];

    return dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date();
  }

  /**
   * Calculate health score based on various metrics
   */
  private calculateHealthScore(metrics: {
    userCount: number;
    projectCount: number;
    pageCount: number;
    storageUsed: number;
    lastActivity: Date;
  }): number {
    let score = 100;

    // Deduct points for low activity
    const hoursSinceActivity = (Date.now() - metrics.lastActivity.getTime()) / (1000 * 60 * 60);
    if (hoursSinceActivity > 24) {
      score -= Math.min(30, hoursSinceActivity / 24 * 5);
    }

    // Deduct points for high storage usage
    if (metrics.storageUsed > 500000000) { // 500MB
      score -= Math.min(20, (metrics.storageUsed - 500000000) / 100000000 * 5);
    }

    // Deduct points for too many users (potential abuse)
    if (metrics.userCount > 50) {
      score -= Math.min(15, (metrics.userCount - 50) / 10 * 2);
    }

    return Math.max(0, Math.round(score));
  }
}
