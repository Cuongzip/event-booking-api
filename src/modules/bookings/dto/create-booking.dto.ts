import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive } from 'class-validator';

export class CreateBookingDto {
  //eventId
  @ApiProperty({
    example: 3,
  })
  @IsInt({
    message: 'Số lượng phải là số nguyên',
  })
  @IsPositive({
    message: 'Số lượng phải là số nguyên dương',
  })
  eventId!: number;
  //quantity
  @ApiProperty({
    example: 3,
  })
  @IsInt({
    message: 'Số lượng phải là số nguyên',
  })
  @IsPositive({
    message: 'Số lượng phải là số nguyên dương',
  })
  quantity!: number;
}
