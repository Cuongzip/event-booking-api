import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class CreatePaymentDto {
  //bookingId
  @ApiProperty({
    name: 'bookingId',
    example: 1,
  })
  @IsInt({
    message: 'Mã booking phải là số nguyên',
  })
  bookingId!: number;

  //transactionId
  @ApiPropertyOptional({
    name: 'transactionId',
    example: 'ABC-123',
  })
  @IsOptional()
  transactionId!: string;
}
