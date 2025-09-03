import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ThemeTemplatesController } from './theme-templates.controller';
import { ThemeTemplatesService } from './theme-templates.service';

@Module({
	imports: [DatabaseModule],
	controllers: [ThemeTemplatesController],
	providers: [ThemeTemplatesService],
	exports: [ThemeTemplatesService],
})
export class ThemeTemplatesModule {}

