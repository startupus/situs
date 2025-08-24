import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserGroupsController } from './user-groups.controller';
import { UserGroupsService } from './user-groups.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserGroupsController],
  providers: [UserGroupsService],
  exports: [UserGroupsService],
})
export class UserGroupsModule {}
