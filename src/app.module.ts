import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';

import { validate } from './config/env.validation.js';
import { AppService } from './app.service.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { AppController } from './app.controller.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { UsersModule } from './modules/users/users.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { RolesGuard } from './modules/auth/guards/roles.guard.js';
import { AuthGuard } from './modules/auth/guards/auth.guard.js';
import { EventsModule } from './modules/events/events.module.js';
@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100,
      },
    ]),

    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),

    UsersModule,
    AuthModule,
    AdminModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: AuthGuard },

    { provide: APP_GUARD, useClass: RolesGuard },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
