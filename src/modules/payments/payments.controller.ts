import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { type RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';

import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { PaymentResponseDto } from './dto/payment-response.dto.js';
import { type JwtPayload } from '../auth/types/jwt-payload.type.js';
import { User } from '../../common/decorators/user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';

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

  //Post: payments/webhook
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    await this.paymentsService.handleWebhook(signature, req);
    return {
      message: 'Đã nhận thông tin',
    };
  }
}
