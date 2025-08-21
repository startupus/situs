import { Body, Controller, Delete, Get, Param, Post, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Scopes } from '../common/decorators/roles.decorator';

@Controller('api/agency-clients')
export class AgencyClientController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':agencyAccountId')
  @Scopes('ACCOUNT_READ')
  async list(@Param('agencyAccountId') agencyAccountId: string) {
    const clients = await this.prisma.agencyClient.findMany({ where: { agencyAccountId }, include: { client: true } });
    return { success: true, data: clients };
  }

  @Post()
  @Scopes('ACCOUNT_WRITE')
  async create(@Body() body: { agencyAccountId: string; clientAccountId: string }) {
    // Валидация существования аккаунтов
    const [agency, client] = await Promise.all([
      this.prisma.account.findUnique({ where: { id: body.agencyAccountId }, select: { id: true } }),
      this.prisma.account.findUnique({ where: { id: body.clientAccountId }, select: { id: true } }),
    ]);
    if (!agency || !client) {
      throw new BadRequestException('Agency or client account not found');
    }
    const link = await this.prisma.agencyClient.create({ data: body });
    return { success: true, data: link };
  }

  @Delete(':id')
  @Scopes('ACCOUNT_ADMIN')
  async remove(@Param('id') id: string) {
    await this.prisma.agencyClient.delete({ where: { id } });
    return { success: true };
  }
}