import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Roles } from '../../../common/decorators/roles.decorator.js';
import { ROLE } from '../../../common/constants/role.constant.js';
import { EventsService } from '../../events/events.service.js';
import { CreateDto } from '../../events/dto/create.dto.js';
import { EventResponseDto } from '../../events/dto/event-response.dto.js';
import { UpdateDto } from '../../events/dto/update.dto.js';
import { ParseIntPipe } from '../../../common/pipes/parse-int.pipe.js';

@ApiTags('admin/events')
@ApiBearerAuth()
@Roles([ROLE.ADMIN])
@ApiUnauthorizedResponse({
  description: 'Access token không được cung cấp, không hợp lệ hoặc hết hạn',
})
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
  @ApiBadRequestResponse({
    description: 'Lỗi validate dữ liệu đầu vào',
  })
  @Post()
  async create(
    @Body()
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

  // Put: admin/events/:id
  @ApiOperation({
    summary: 'Cập nhật event',
    description: 'Cập nhật event vào hệ thống',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại thông tin event đã cập nhật',
    type: EventResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Lỗi validate dữ liệu đầu vào',
  })
  @ApiParam({
    name: 'id',
    description: 'mã Event',
    example: 1,
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe('ID phải là số nguyên')) id: number,
    @Body()
    UpdateDto: UpdateDto,
  ): Promise<{
    data: EventResponseDto;
    message: string;
  }> {
    return {
      data: await this.eventsService.updateById(id, UpdateDto),
      message: 'Cập nhật thành công',
    };
  }

  // delete: admin/events/:id
  @ApiOperation({
    summary: 'Xóa event',
    description: 'Xóa event vào hệ thống',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại thông báo xóa thành công',
  })
  @ApiBadRequestResponse({
    description: 'Lỗi validate dữ liệu đầu vào',
  })
  @ApiParam({
    name: 'id',
    description: 'mã Event',
    example: 1,
  })
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe('ID phải là số nguyên')) id: number,
  ): Promise<{
    message: string;
  }> {
    await this.eventsService.deleteById(id);
    return {
      message: 'Xóa thành công',
    };
  }
}
