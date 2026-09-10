import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  EVENT_STATUS,
  type EventStatus,
} from '../../../common/constants/event-status.constant.js';

export class CreateDto {
  //title
  @ApiProperty({
    name: 'title',
    example: 'Taylor Swift - The Eras Tour',
  })
  @IsNotEmpty({
    message: 'Tiêu đề là bắt buộc',
  })
  @MinLength(10, {
    message: 'Độ dài tối thiểu của tiêu đề là 10 ký tự',
  })
  @MaxLength(500, {
    message: 'Độ dài tối đa của tiêu đề là 500 ký tự',
  })
  title!: string;

  //description
  @ApiPropertyOptional({
    name: 'description',
    example: 'Live concert',
  })
  @IsOptional()
  @MaxLength(500, {
    message: 'Độ dài tối đa của tiêu đề là 500 ký tự',
  })
  description?: string;

  //capacity
  @ApiProperty({
    name: 'capacity',
    example: 100,
  })
  @IsNotEmpty({
    message: 'Sức chứa của event là bắt buộc',
  })
  @IsInt({
    message: 'Sức chứa của event phải là số nguyên',
  })
  @IsPositive({
    message: 'Sức chứa của event phải lớn hơn 0',
  })
  capacity!: number;

  //availableSeats
  @ApiProperty({
    name: 'availableSeats',
    example: 100,
  })
  @IsNotEmpty({
    message: 'Số chỗ trống của event là bắt buộc',
  })
  @IsInt({
    message: 'Số chỗ trống của event phải là số nguyên',
  })
  @Min(70, {
    message: 'Số chỗ trống của event phải lớn hơn hoặc bằng 0',
  })
  availableSeats!: number;

  //location
  @ApiProperty({
    name: 'location',
    example: 'My Dinh National Stadium',
  })
  @IsNotEmpty({
    message: 'Tiêu đề là bắt buộc',
  })
  @MinLength(10, {
    message: 'Độ dài tối thiểu của tiêu đề là 10 ký tự',
  })
  @MaxLength(500, {
    message: 'Độ dài tối đa của tiêu đề là 500 ký tự',
  })
  location!: string;

  //price
  @ApiProperty({
    name: 'price',
    example: 10000,
  })
  @IsNotEmpty({
    message: 'Giá của event là bắt buộc',
  })
  @IsPositive({
    message: 'Giá của event phải lớn hơn 0',
  })
  price!: number;

  //status
  @ApiPropertyOptional({
    name: 'status',
    example: 'DRAFT',
  })
  @IsOptional()
  @IsIn(Object.values(EVENT_STATUS), {
    message: 'Event status phải thuộc: DRAFT, PUBLISHED, CANCELLED, ENDED',
  })
  status?: EventStatus;

  //endAt
  @ApiProperty({
    name: 'endAt',
    example: '2026-09-05 14:06:52.883317+07',
  })
  @IsDateString({}, { message: 'Ngày kết thúc phải là thời gian dạng chuỗi' })
  endAt!: string;

  //startAt
  @ApiProperty({
    name: 'startAt',
    example: '2026-09-05 14:06:52.883317+07',
  })
  @IsDateString({}, { message: 'Ngày bắt đầu phải là thời gian dạng chuỗi' })
  startAt!: string;
}
