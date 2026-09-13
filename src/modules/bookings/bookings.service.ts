import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import { BookingResponseDto } from './dto/booking-response.dto.js';
import { db } from '../../prisma/db.js';

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

    if (event.status !== 'PUBLISHED')
      throw new BadRequestException('Event không mở đặt vé');

    if (new Date(event.startAt) <= new Date())
      throw new BadRequestException('Event đã bắt đầu không thể đặt vé');

    const decreaseSeats = db.raw.sql`
  UPDATE "events"
  SET "availableSeats" = "availableSeats" - ${quantity}
  WHERE "id" = ${eventId}
    AND "availableSeats" >= ${quantity}
`
      .affectedCount()
      .build();

    const { affectedRows } = await db.runtime().execute(decreaseSeats);

    if (affectedRows === 0) throw new BadRequestException('Không đủ chỗ trống');

    const totalPrice = quantity * event.price;

    const expiresAt = new Date(Date.now() + 100 * 60 * 60 * 10).toISOString();

    return await db.orm.public.Booking.create({
      userId,
      eventId,
      totalPrice,
      expiresAt,
      quantity,
    });
  }

  async findByUserId(userId: number): Promise<BookingResponseDto[]> {
    return await db.orm.public.Booking.where({ userId }).include('event').all();
  }
  findAll() {
    return `This action returns all bookings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
