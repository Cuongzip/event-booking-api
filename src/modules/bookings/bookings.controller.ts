import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BookingResponseDto } from './dto/booking-response.dto.js';
import { User } from '../../common/decorators/user.decorator.js';
import { type JwtPayload } from '../auth/types/jwt-payload.type.js';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  //Get: users/me
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Đặt vé',
    description: 'Tạo thông tin đặt vé trên hệ thống',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại thông tin đặt vé',
    type: BookingResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Event không tồn tại',
  })
  @ApiBadRequestResponse({
    description: 'Không đủ chỗ trống',
  })
  @ApiUnauthorizedResponse({
    description: 'Access token không được cung cấp, không hợp lệ hoặc hết hạn',
  })
  @Post()
  async create(
    @User() user: JwtPayload,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<{
    data: BookingResponseDto;
  }> {
    return {
      data: await this.bookingsService.create(user.sub, createBookingDto),
    };
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}
