import { Module } from '@nestjs/common';

import { AdminUsersController } from './users/admin-users.controller.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [UsersModule],
  controllers: [AdminUsersController],
})
export class AdminModule {}
