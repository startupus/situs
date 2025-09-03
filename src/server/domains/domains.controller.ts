import { Controller, Get, Query } from '@nestjs/common';
import dns from 'dns/promises';

@Controller('api/domains')
export class DomainsController {
  @Get('check')
  async check(@Query('domain') domain: string, @Query('type') type: 'A' | 'CNAME' = 'CNAME') {
    if (!domain) return { success: false, error: 'domain is required' };
    try {
      const records = type === 'A' ? await dns.resolve4(domain) : await dns.resolveCname(domain);
      return { success: true, data: { type, records } };
    } catch (e: any) {
      return { success: false, error: e?.message || 'DNS lookup failed' };
    }
  }
}
