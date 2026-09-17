import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateBookingDto } from './dto/create-booking.dto.js';
import { BookingResponseDto } from './dto/booking-response.dto.js';
import { db } from '../../prisma/db.js';
import { BOOKING_STATUS } from '../../common/constants/booking-status.constant.js';
import { EVENT_STATUS } from '../../common/constants/event-status.constant.js';

@Injectable()
export class BookingsService {
  async create(
    userId: number,
    createBookingDto: CreateBookingDto,
  ): Promise<BookingResponseDto> {
    const { eventId, quantity } = createBookingDto;

    const event = await db.orm.public.Event.where({
      id: eventId,
    }).first();

    if (!event) throw new NotFoundException('Event không tồn tại');

    if (event.status !== EVENT_STATUS.PUBLISHED)
      throw new BadRequestException('Event không mở đặt vé');

    if (new Date(event.startAt) <= new Date())
      throw new BadRequestException('Event đã bắt đầu không thể đặt vé');

    if (event.availableSeats < quantity) {
      throw new BadRequestException('Không đủ chỗ trống');
    }
    const decreaseSeats = db.raw
      .sql`update "events" set "availableSeats" = "availableSeats" - ${quantity} where "id" = ${eventId} and "status" = ${EVENT_STATUS.PUBLISHED} and "startAt" > now() and "availableSeats" >= ${quantity}`
      .affectedCount()
      .build();

    const result = await db.transaction(async (tx) => {
      const { affectedRows } = await tx.execute(decreaseSeats);

      if (affectedRows === 0)
        throw new BadRequestException(
          'Event không còn đáp ứng điều kiện để booking',
        );

      const totalPrice = quantity * event.price;

      const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString();

      const booking = await tx.orm.public.Booking.create({
        userId,
        eventId,
        totalPrice,
        expiresAt,
        quantity,
      });

      return booking;
    });

    return result;
  }

  async findByUserId(userId: number): Promise<BookingResponseDto[]> {
    return await db.orm.public.Booking.where({ userId }).include('event').all();
  }

  async cancel(userId: number, bookingId: number): Promise<void> {
    const booking = await db.orm.public.Booking.where({
      userId,
      id: bookingId,
    }).first();

    if (!booking) throw new NotFoundException('Booking không tồn tại');

    const statusError = new BadRequestException(
      'Booking chỉ có thể hủy khi ở trạng thái pending hoặc confirmed',
    );
    if (
      booking.status !== BOOKING_STATUS.PENDING &&
      booking.status !== BOOKING_STATUS.CONFIRMED
    )
      throw statusError;

    const event = (await db.orm.public.Event.where({
      id: booking.eventId,
    }).first())!;

    const deadline = new Date(event.startAt).getTime() - 1000 * 60 * 60 * 24;

    const deadlineError = new BadRequestException(
      'Booking chỉ được hủy trước khi event bắt đầu 24h',
    );
    if (Date.now() >= deadline) throw deadlineError;

    const refundSeats = db.raw
      .sql`update "events" set "availableSeats" = "availableSeats" + (select "quantity" from "bookings" where "bookings"."id" = ${bookingId}) where "id" = ${booking.eventId} and "startAt" > now() + interval '24 hours'`
      .affectedCount()
      .build();

    await db.transaction(async (tx) => {
      const result = await tx.orm.public.Booking.where({
        id: bookingId,
        status: booking.status,
      }).update({
        status: BOOKING_STATUS.CANCELLED,
      });

      if (!result) throw statusError;

      const { affectedRows } = await tx.execute(refundSeats);
      if (affectedRows === 0) throw deadlineError;
      if (booking.status === BOOKING_STATUS.CONFIRMED) {
        // refund payment
      }
    });
  }
}
