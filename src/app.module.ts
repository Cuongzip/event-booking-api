import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { validate } from './config/env.validation.js';
import { AppService } from './app.service.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { AppController } from './app.controller.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { PrismaService } from './prisma.service.js';
@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
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
