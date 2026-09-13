import { ApiProperty } from '@nestjs/swagger';
import {
  BOOKING_STATUS,
  type BookingStatus,
} from '../../../common/constants/booking-status.constant.js';

export class BookingResponseDto {
  //id
  @ApiProperty({
    example: 1,
  })
  id!: number;
  //userId
  @ApiProperty({
    example: 1,
  })
  userId!: number;
  //eventId
  @ApiProperty({
    example: 1,
  })
  eventId!: number;

  //quantity
  @ApiProperty({
    example: 3,
  })
  quantity!: number;

  //status
  @ApiProperty({
    example: BOOKING_STATUS.PENDING,
  })
  status!: BookingStatus;

  //totalPrice
  @ApiProperty({
    example: 300000,
  })
  totalPrice!: number;

  //expiresAt
  @ApiProperty({
    example: '2026-09-05 14:06:52.883317+07',
  })
  expiresAt!: string;

  //createdAt
  @ApiProperty({
    example: '2026-09-05 14:06:52.883317+07',
  })
  createdAt!: string;
  //updatedAt
  @ApiProperty({
    example: '2026-09-05 14:06:52.883317+07',
  })
  updatedAt!: string;
}
