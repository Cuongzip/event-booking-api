import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '../../../common/decorators/roles.decorator.js';
import { ROLE } from '../../../common/constants/role.constant.js';
import { EventsService } from '../../events/events.service.js';
import { CreateDto } from '../../events/dto/create.dto.js';
import { CreateResponseDto } from '../../events/dto/create-response.dto.js';

@ApiTags('admin/events')
@ApiBearerAuth()
@Roles([ROLE.ADMIN])
@ApiForbiddenResponse({
  description: 'Bạn không có quyền thực hiện chức năng này',
})
@Controller({
  path: 'admin/events',
  version: '1',
})
export class AdminEventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Post: admin/events
  @ApiOperation({
    summary: 'Thêm event',
    description: 'Thêm event vào hệ thống',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại thông tin event đã thêm',
    type: CreateResponseDto,
  })
  @Post()
  async create(
    @Body(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    createDto: CreateDto,
  ): Promise<{
    data: CreateResponseDto;
    message: string;
  }> {
    return {
      data: await this.eventsService.create(createDto),
      message: 'Thêm thành công',
    };
  }
}
