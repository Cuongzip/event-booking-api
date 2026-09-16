import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { db } from '../../prisma/db.js';
import { BOOKING_STATUS } from '../../common/constants/booking-status.constant.js';
import { PAYMENT_STATUS } from '../../common/constants/payment-status.constant.js';
import { PaymentResponseDto } from './dto/payment-response.dto.js';

@Injectable()
export class PaymentsService {
  async create(
    userId: number,
    createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    const { bookingId, transactionId } = createPaymentDto;

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

    return db.orm.public.Payment.create({
      amount: booking.totalPrice,
      bookingId: booking.id,
      expiresAt: paymentExpiresAt,
      transactionId: transactionId,
    });
  }
}
