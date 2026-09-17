import {
  BadRequestException,
  Injectable,
  type RawBodyRequest,
} from '@nestjs/common';
import { Request } from 'express';

import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { db } from '../../prisma/db.js';
import { BOOKING_STATUS } from '../../common/constants/booking-status.constant.js';
import { PAYMENT_STATUS } from '../../common/constants/payment-status.constant.js';
import { PaymentResponseDto } from './dto/payment-response.dto.js';
import { StripeService } from '../../stripe.service.js';

@Injectable()
export class PaymentsService {
  constructor(private readonly stripeService: StripeService) {}

  async create(
    userId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    const { bookingId } = createPaymentDto;

    const booking = await db.orm.public.Booking.where({
      id: bookingId,
    }).first();

    if (!booking) throw new BadRequestException('Booking không tồn tại');

    if (booking.userId !== userId)
      throw new BadRequestException('Booking này không thuộc về bạn');

    const bookingExpiresAt = new Date(booking.expiresAt).getTime();
    if (
      booking.status !== BOOKING_STATUS.PENDING ||
      bookingExpiresAt <= Date.now()
    )
      throw new BadRequestException(
        'Booking phải ở trạng thái pending mới có thể thanh toán',
      );

    const pendingPayment = await db.orm.public.Payment.where({
      bookingId,
      status: PAYMENT_STATUS.PENDING,
    }).first();

    if (pendingPayment)
      throw new BadRequestException('Booking đang được thanh toán');

    const paymentExpiresAt = new Date(
      Math.min(Date.now() + 1000 * 60 * 5, bookingExpiresAt),
    ).toISOString();

    //chưa xử lý race condition
    const paymentIntent = await this.stripeService.createPaymentIntent(
      booking.totalPrice,
    );

    const result = await db.orm.public.Payment.create({
      amount: booking.totalPrice,
      bookingId: booking.id,
      expiresAt: paymentExpiresAt,
      transactionId: paymentIntent.id,
    });
    return { ...result, clientSecret: paymentIntent.client_secret };
  }

  async handleWebhook(signature: string, req: RawBodyRequest<Request>) {
    if (!signature) {
      throw new BadRequestException(
        'Không tìm thấy stripe signature trong header',
      );
    }

    if (!req.rawBody) {
      throw new BadRequestException('Không tìm thấy rawbody trong request');
    }

    const event = this.stripeService.constructEventFromPayload(
      signature,
      req.rawBody,
    );

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const { id: transactionId } = event.data.object;

        await db.orm.public.Payment.where({
          transactionId,
        }).update({
          status: PAYMENT_STATUS.SUCCESS,
        });

        break;
      }
      case 'payment_intent.payment_failed': {
        const { id: transactionId } = event.data.object;

        await db.orm.public.Payment.where({
          transactionId,
        }).update({
          status: PAYMENT_STATUS.FAILED,
        });
        break;
      }
      default:
        console.log(`Sự kiện khác: ${event.type}`);
    }
  }
}
