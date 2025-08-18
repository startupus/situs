import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Scopes } from '../common/decorators/roles.decorator';

@Controller('api/accounts')
export class AccountsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Scopes('ACCOUNT_READ')
  async list() {
    const accounts = await this.prisma.account.findMany({ orderBy: { createdAt: 'desc' } });
    return { success: true, data: accounts };
  }

  @Get(':id')
  @Scopes('ACCOUNT_READ')
  async get(@Param('id') id: string) {
    const account = await this.prisma.account.findUnique({ where: { id } });
    return { success: true, data: account };
  }

  @Post()
  @Scopes('ACCOUNT_WRITE')
  async create(@Body() dto: CreateAccountDto) {
    const account = await this.prisma.account.create({ data: { name: dto.name, type: dto.type as any, ownerId: dto.ownerId } });
    return { success: true, data: account };
  }

  @Patch(':id')
  @Scopes('ACCOUNT_WRITE')
  async update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    const account = await this.prisma.account.update({ where: { id }, data: { name: dto.name, type: (dto.type as any) || undefined } });
    return { success: true, data: account };
  }

  @Delete(':id')
  @Scopes('ACCOUNT_ADMIN')
  async remove(@Param('id') id: string) {
    await this.prisma.account.delete({ where: { id } });
    return { success: true };
  }
}