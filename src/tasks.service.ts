import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { db } from './prisma/db.js';
import { BOOKING_STATUS } from './common/constants/booking-status.constant.js';
import { EVENT_STATUS } from './common/constants/event-status.constant.js';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredBooking() {
    const bookings = await db.orm.public.Booking.where({
      status: BOOKING_STATUS.PENDING,
    })
      .where((b) => b.expiresAt.lte(new Date().toISOString()))
      .all();

    for (const booking of bookings) {
      const { id, eventId, status, quantity } = booking;
      const refundSeats = db.raw
        .sql`update "events" set "availableSeats" = "availableSeats" + ${quantity}  where "id" = ${eventId}`
        .affectedCount()
        .build();

      await db.transaction(async (tx) => {
        const result = await tx.orm.public.Booking.where({
          id,
          status,
        }).update({
          status: BOOKING_STATUS.EXPIRED,
        });

        if (!result) throw new Error(`Booking ${id} không tồn tại`);

        const { affectedRows } = await tx.execute(refundSeats);

        if (affectedRows === 0) {
          throw new Error(`Event ${eventId} không tồn tại`);
        }
      });
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleEndedEvent() {
    const events = await db.orm.public.Event.where({
      status: EVENT_STATUS.PUBLISHED,
    })
      .where((e) => e.endAt.lte(new Date().toISOString()))
      .all();

    for (const event of events) {
      const { id, status } = event;
      await db.orm.public.Event.where({
        id,
        status,
      }).update({
        status: EVENT_STATUS.ENDED,
      });
    }
  }
}
