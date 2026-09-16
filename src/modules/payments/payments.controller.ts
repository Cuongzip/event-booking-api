import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { PaymentResponseDto } from './dto/payment-response.dto.js';
import { type JwtPayload } from '../auth/types/jwt-payload.type.js';
import { User } from '../../common/decorators/user.decorator.js';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  //Post: payments
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Thanh toán',
    description: 'Tạo thông tin thanh toán trên hệ thống',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại thông tin thanh toán',
    type: PaymentResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Access token không được cung cấp, không hợp lệ hoặc hết hạn',
  })
  @Post()
  async create(
    @User() user: JwtPayload,
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<{
    data: PaymentResponseDto;
    message: string;
  }> {
    return {
      data: await this.paymentsService.create(user.sub, createPaymentDto),
      message: 'Tạo booking thành công',
    };
  }
}
