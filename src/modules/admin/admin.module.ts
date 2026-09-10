import { Module } from '@nestjs/common';

import { AdminUsersController } from './users/admin-users.controller.js';
import { UsersModule } from '../users/users.module.js';
import { AdminEventsController } from './events/admin-event.controller.js';
import { EventsModule } from '../events/events.module.js';

@Module({
  imports: [UsersModule, EventsModule],
  controllers: [AdminUsersController, AdminEventsController],
})
export class AdminModule {}
