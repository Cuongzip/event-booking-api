import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { BookingResponseDto } from './dto/booking-response.dto.js';
import { User } from '../../common/decorators/user.decorator.js';
import { type JwtPayload } from '../auth/types/jwt-payload.type.js';
import { ParseIntPipe } from '../../common/pipes/parse-int.pipe.js';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  //Get: bookings
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
    message: string;
  }> {
    return {
      data: await this.bookingsService.create(user.sub, createBookingDto),
      message: 'Tạo booking thành công',
    };
  }

  //Get: bookings/my
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách booking của mình',
    description: 'Lấy danh sách booking của mình',
  })
  @ApiOkResponse({
    description: 'Nhận lại danh sách booking của mình',
    type: BookingResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({
    description: 'Access token không được cung cấp, không hợp lệ hoặc hết hạn',
  })
  @Get('me')
  async findMy(@User() user: JwtPayload): Promise<{
    data: BookingResponseDto[];
  }> {
    return {
      data: await this.bookingsService.findByUserId(user.sub),
    };
  }

  //Patch: bookings/:id/cancel
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Hủy booking',
    description: 'Hủy booking',
  })
  @ApiOkResponse({
    description: 'Nhận lại thông báo thành công',
    type: BookingResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Access token không được cung cấp, không hợp lệ hoặc hết hạn',
  })
  @ApiParam({
    name: 'id',
    description: 'Mã booking',
    example: 1,
  })
  @Patch(':id/cancel')
  async cancel(
    @User() user: JwtPayload,
    @Param('id', ParseIntPipe('ID phải là số nguyên')) bookingId: number,
  ): Promise<{
    message: string;
  }> {
    await this.bookingsService.cancel(user.sub, bookingId);
    return {
      message: 'Hủy booking thành công',
    };
  }
}
