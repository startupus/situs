import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Controller('api/agency-clients')
export class AgencyClientController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':agencyAccountId')
  async list(@Param('agencyAccountId') agencyAccountId: string) {
    const clients = await this.prisma.agencyClient.findMany({ where: { agencyAccountId }, include: { client: true } });
    return { success: true, data: clients };
  }

  @Post()
  async create(@Body() body: { agencyAccountId: string; clientAccountId: string }) {
    const link = await this.prisma.agencyClient.create({ data: body });
    return { success: true, data: link };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.prisma.agencyClient.delete({ where: { id } });
    return { success: true };
  }
}