import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAccountMembershipDto } from './dto/create-account-membership.dto';
import { Scopes } from '../common/decorators/roles.decorator';

@Controller('api/account-memberships')
export class AccountMembershipsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get(':accountId')
  @Scopes('ACCOUNT_READ')
  async list(@Param('accountId') accountId: string) {
    const members = await this.prisma.accountMembership.findMany({ where: { accountId }, include: { user: { select: { email: true, username: true } } } });
    return { success: true, data: members };
  }

  @Post()
  @Scopes('ACCOUNT_WRITE')
  async create(@Body() dto: CreateAccountMembershipDto) {
    const member = await this.prisma.accountMembership.upsert({
      where: { accountId_userId: { accountId: dto.accountId, userId: dto.userId } as any },
      update: { role: dto.role as any },
      create: { accountId: dto.accountId, userId: dto.userId, role: dto.role as any },
    });
    return { success: true, data: member };
  }

  @Patch(':id')
  @Scopes('ACCOUNT_WRITE')
  async update(@Param('id') id: string, @Body('role') role: string) {
    const updated = await this.prisma.accountMembership.update({ where: { id }, data: { role: role as any } });
    return { success: true, data: updated };
  }

  @Delete(':id')
  @Scopes('ACCOUNT_ADMIN')
  async remove(@Param('id') id: string) {
    await this.prisma.accountMembership.delete({ where: { id } });
    return { success: true };
  }
}