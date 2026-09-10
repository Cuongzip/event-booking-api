import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '../../../common/decorators/roles.decorator.js';
import { ROLE } from '../../../common/constants/role.constant.js';
import { EventsService } from '../../events/events.service.js';
import { CreateDto } from '../../events/dto/create.dto.js';
import { EventResponseDto } from '../../events/dto/event-response.dto.js';
import { UpdateDto } from '../../events/dto/update.dto.js';

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
    type: EventResponseDto,
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
    data: EventResponseDto;
    message: string;
  }> {
    return {
      data: await this.eventsService.create(createDto),
      message: 'Thêm thành công',
    };
  }

  // Put: admin/events
  @ApiOperation({
    summary: 'Cập nhật event',
    description: 'Cập nhật event vào hệ thống',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại thông tin event đã cập nhật',
    type: EventResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'mã Event',
    example: 'taylor-swift-the-eras-tour',
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    UpdateDto: UpdateDto,
  ): Promise<{
    data: EventResponseDto;
    message: string;
  }> {
    return {
      data: await this.eventsService.updateById(id, UpdateDto),
      message: 'Thêm thành công',
    };
  }
}
