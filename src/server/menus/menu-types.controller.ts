import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query 
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuTypeDto } from './dto/create-menu-type.dto';
import { UpdateMenuTypeDto } from './dto/update-menu-type.dto';
import { Scopes } from '../common/decorators/roles.decorator';

/**
 * Контроллер типов меню
 */
@Controller('menu-types')
export class MenuTypesController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  @Scopes('PROJECT_READ')
  async findAll(@Query('projectId') projectId: string) {
    if (!projectId) {
      return { success: false, error: 'Параметр projectId обязателен' };
    }

    const menuTypes = await this.menusService.findMenuTypes(projectId);
    return { success: true, data: menuTypes };
  }

  @Get(':id')
  @Scopes('PROJECT_READ')
  async findOne(@Param('id') id: string) {
    const menuType = await this.menusService.findMenuTypeById(id);
    return { success: true, data: menuType };
  }

  @Post()
  @Scopes('PROJECT_WRITE')
  async create(@Body() dto: CreateMenuTypeDto) {
    const menuType = await this.menusService.createMenuType(dto);
    return { success: true, data: menuType };
  }

  @Put(':id')
  @Scopes('PROJECT_WRITE')
  async update(@Param('id') id: string, @Body() dto: UpdateMenuTypeDto) {
    const menuType = await this.menusService.updateMenuType(id, dto);
    return { success: true, data: menuType };
  }

  @Delete(':id')
  @Scopes('PROJECT_WRITE')
  async remove(@Param('id') id: string) {
    await this.menusService.removeMenuType(id);
    return { success: true, message: 'Тип меню успешно удален' };
  }
}
