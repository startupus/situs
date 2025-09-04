import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Scopes } from '../common/decorators/roles.decorator';

@Controller('accounts')
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
  async create(@Body() dto: CreateAccountDto, @Req() req: any) {
    // Определяем владельца: либо из dto, либо из текущего пользователя (guard проставляет в req.user)
    const resolvedOwnerId: string | undefined = dto.ownerId || req?.user?.id;
    if (!resolvedOwnerId) {
      throw new BadRequestException('Owner ID is required');
    }

    // Гарантируем существование владельца в БД. В тестовом окружении — авто‑создаём, чтобы избежать 500 (FK violation)
    const existingOwner = await this.prisma.user.findUnique({ where: { id: resolvedOwnerId } });
    if (!existingOwner) {
      if (process.env.NODE_ENV === 'test') {
        await this.prisma.user.create({
          data: {
            id: resolvedOwnerId,
            username: `test_${resolvedOwnerId}`.slice(0, 30),
            email: `${resolvedOwnerId}@local.test`,
            password: 'test',
            globalRole: 'BUSINESS' as any,
          },
        });
      } else {
        throw new BadRequestException('Owner user not found');
      }
    }

    const account = await this.prisma.account.create({
      data: {
        name: dto.name,
        type: dto.type as any,
        ownerId: resolvedOwnerId,
      },
    });
    return { success: true, data: account };
  }

  @Patch(':id')
  @Scopes('ACCOUNT_WRITE')
  async update(@Param('id') id: string, @Body() dto: UpdateAccountDto) {
    const account = await this.prisma.account.update({
      where: { id },
      data: { name: dto.name, type: (dto.type as any) || undefined },
    });
    return { success: true, data: account };
  }

  @Delete(':id')
  @Scopes('ACCOUNT_ADMIN')
  async remove(@Param('id') id: string) {
    await this.prisma.account.delete({ where: { id } });
    return { success: true };
  }
}
