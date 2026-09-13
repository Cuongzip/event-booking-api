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
  @ApiCreatedResponse({
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
}
