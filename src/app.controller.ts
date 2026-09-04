import { BadRequestException, Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service.js';
@ApiTags('/')
@Controller({
  path: '/',
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): { data: string } {
    const data = this.appService.getHello();
    return {
      data,
    };
  }
}
