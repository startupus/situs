import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AccountsController } from './accounts.controller';
import { AccountMembershipsController } from './accounts-memberships.controller';
import { AgencyClientController } from './agency-client.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [AccountsController, AccountMembershipsController, AgencyClientController],
})
export class AccountsModule {}