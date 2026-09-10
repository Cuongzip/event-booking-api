import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventsService } from './events.service.js';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { EventResponseDto } from './dto/event-response.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { FindDto } from './dto/find.dto.js';
import { EVENT_STATUS } from '../../common/constants/event-status.constant.js';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  //Get: /events
  @ApiOperation({
    summary: 'Lấy danh sách Event',
    description: 'Lấy danh sách tất cả các Event',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại danh sách các Event',
    type: EventResponseDto,
    isArray: true,
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    example: 'tay',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    example: EVENT_STATUS.PUBLISHED,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    example: 'desc',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  @Public()
  @Get()
  async findAll(
    @Query()
    findDto: FindDto,
  ): Promise<{
    data: EventResponseDto[];
  }> {
    return {
      data: await this.eventsService.findAll(findDto),
    };
  }
  //Get: /events/:id
  @ApiOperation({
    summary: 'Lấy Event',
    description: 'Lấy Event theo id',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại Event',
    type: EventResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Mã event',
    example: 1,
  })
  @Public()
  @Get(':id')
  async findById(
    @Param('id', ParseIntPipe('ID phải là số nguyên')) id: number,
  ): Promise<{
    data: EventResponseDto;
  }> {
    return {
      data: await this.eventsService.findById(id),
    };
  }
}
