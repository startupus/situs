import { Module } from '@nestjs/common';
import { PublicSeoController } from './public.controller';

@Module({
  controllers: [PublicSeoController],
})
export class SeoModule {}