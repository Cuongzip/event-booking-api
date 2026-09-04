import { BadRequestException, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
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
