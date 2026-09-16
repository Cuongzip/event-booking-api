import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  PAYMENT_STATUS,
  type PaymentStatus,
} from '../../../common/constants/payment-status.constant.js';

export class PaymentResponseDto {
  //id
  @ApiProperty({
    name: 'id',
    example: 1,
  })
  id!: number;

  //bookingId
  @ApiProperty({
    name: 'bookingId',
    example: 1,
  })
  bookingId!: number;

  //amount
  @ApiProperty({
    name: 'amount',
    example: 20000,
  })
  amount!: number;

  //transactionId
  @ApiPropertyOptional({
    name: 'transactionId',
    example: 'ABC-123',
  })
  transactionId?: string | null;

  //status
  @ApiProperty({
    name: 'status',
    example: PAYMENT_STATUS.PENDING,
  })
  status!: PaymentStatus;

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
