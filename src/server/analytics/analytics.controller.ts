import { Controller, Get, Query } from '@nestjs/common';
import { Scopes } from '../common/decorators/roles.decorator';

@Controller('api/analytics')
export class AnalyticsController {
  @Get('dashboard')
  @Scopes('PROJECT_READ')
  dashboard() {
    return {
      success: true,
      data: {
        projects: { total: 12, active: 9, published: 7, draft: 5 },
        users: { total: 150, active: 130, newThisMonth: 12 },
        traffic: { totalViews: 52340, uniqueVisitors: 19873, averageSessionDuration: 215, bounceRate: 42.5 },
        revenue: { totalRevenue: 345678, monthlyRecurring: 12345, conversionRate: 2.4, averageOrderValue: 2450 },
      },
    };
  }

  @Get('traffic')
  @Scopes('PROJECT_READ')
  traffic(@Query('period') period?: string) {
    const days = 7;
    const base = new Date();
    const data = Array.from({ length: days }).map((_, i) => {
      const d = new Date(base.getTime() - (days - i - 1) * 86400000);
      return {
        date: d.toISOString().slice(0, 10),
        views: 1000 + Math.floor(Math.random() * 500),
        visitors: 400 + Math.floor(Math.random() * 200),
        sessions: 600 + Math.floor(Math.random() * 200),
      };
    });
    return { success: true, data };
  }

  @Get('conversions')
  @Scopes('PROJECT_READ')
  conversions() {
    const days = 7;
    const base = new Date();
    const data = Array.from({ length: days }).map((_, i) => {
      const d = new Date(base.getTime() - (days - i - 1) * 86400000);
      const visitors = 400 + Math.floor(Math.random() * 200);
      const conversions = 10 + Math.floor(Math.random() * 30);
      const rate = Math.round((conversions / visitors) * 1000) / 10;
      return { date: d.toISOString().slice(0, 10), conversions, visitors, rate };
    });
    return { success: true, data };
  }

  @Get('projects')
  @Scopes('PROJECT_READ')
  projects() {
    const data = Array.from({ length: 5 }).map((_, i) => ({
      projectId: `pid_${i + 1}`,
      projectName: `Проект ${i + 1}`,
      views: 1000 + Math.floor(Math.random() * 5000),
      visitors: 400 + Math.floor(Math.random() * 2000),
      conversions: 50 + Math.floor(Math.random() * 200),
      revenue: 10000 + Math.floor(Math.random() * 50000),
      lastUpdated: new Date().toISOString(),
    }));
    return { success: true, data };
  }

  @Get('top-pages')
  @Scopes('PROJECT_READ')
  topPages() {
    const data = Array.from({ length: 5 }).map((_, i) => ({
      page: `/page-${i + 1}`,
      views: 1000 + Math.floor(Math.random() * 5000),
      visitors: 400 + Math.floor(Math.random() * 2000),
      bounceRate: Math.round((20 + Math.random() * 40) * 10) / 10,
    }));
    return { success: true, data };
  }

  @Get('traffic-sources')
  @Scopes('PROJECT_READ')
  sources() {
    const data = [
      { source: 'Organic', visitors: 5400, percentage: 45 },
      { source: 'Direct', visitors: 3600, percentage: 30 },
      { source: 'Referral', visitors: 1800, percentage: 15 },
      { source: 'Social', visitors: 1200, percentage: 10 },
    ];
    return { success: true, data };
  }

  @Get('devices')
  @Scopes('PROJECT_READ')
  devices() {
    const data = [
      { device: 'Desktop', users: 7200, percentage: 60 },
      { device: 'Mobile', users: 4200, percentage: 35 },
      { device: 'Tablet', users: 600, percentage: 5 },
    ];
    return { success: true, data };
  }
}