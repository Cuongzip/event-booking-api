import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
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

export class UpdateDto {
  //title
  @ApiPropertyOptional({
    name: 'title',
    example: 'Taylor Swift - The Eras Tour',
  })
  @IsOptional()
  @MinLength(10, {
    message: 'Độ dài tối thiểu của tiêu đề là 10 ký tự',
  })
  @MaxLength(500, {
    message: 'Độ dài tối đa của tiêu đề là 500 ký tự',
  })
  title?: string;

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
  @ApiPropertyOptional({
    name: 'capacity',
    example: 100,
  })
  @IsOptional()
  @IsInt({
    message: 'Sức chứa của event phải là số nguyên',
  })
  @IsPositive({
    message: 'Sức chứa của event phải lớn hơn 0',
  })
  capacity?: number;

  //availableSeats
  @ApiPropertyOptional({
    name: 'availableSeats',
    example: 100,
  })
  @IsOptional()
  @IsInt({
    message: 'Số chỗ trống của event phải là số nguyên',
  })
  @Min(70, {
    message: 'Số chỗ trống của event phải lớn hơn hoặc bằng 0',
  })
  availableSeats?: number;

  //location
  @ApiPropertyOptional({
    name: 'location',
    example: 'My Dinh National Stadium',
  })
  @IsOptional()
  @MinLength(10, {
    message: 'Độ dài tối thiểu của tiêu đề là 10 ký tự',
  })
  @MaxLength(500, {
    message: 'Độ dài tối đa của tiêu đề là 500 ký tự',
  })
  location?: string;

  //price
  @ApiPropertyOptional({
    name: 'price',
    example: 10000,
  })
  @IsOptional()
  @IsPositive({
    message: 'Giá của event phải lớn hơn 0',
  })
  price?: number;

  //endAt
  @ApiPropertyOptional({
    name: 'endAt',
    example: '2026-09-05 14:06:52.883317+07',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc phải là thời gian dạng chuỗi' })
  endAt?: string;

  //startAt
  @ApiPropertyOptional({
    name: 'startAt',
    example: '2026-09-05 14:06:52.883317+07',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu phải là thời gian dạng chuỗi' })
  startAt?: string;
}
