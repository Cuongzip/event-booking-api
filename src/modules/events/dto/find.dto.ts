import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsInt, IsOptional, IsPositive, IsString } from 'class-validator';
import {
  EVENT_STATUS,
  type EventStatus,
} from '../../../common/constants/event-status.constant.js';
import { Type } from 'class-transformer';

export class FindDto {
  //keyword
  @ApiPropertyOptional({
    name: 'keyword',
    example: 'tay',
  })
  @IsOptional()
  keyword?: string;

  //sortBy
  @ApiPropertyOptional({
    name: 'sortBy',
    example: 'title',
  })
  @IsOptional()
  sortBy?: 'title' | 'startAt' | 'createdAt';

  //sortOrder
  @ApiPropertyOptional({
    name: 'sortOrder',
    example: 'desc',
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  //limit
  @ApiPropertyOptional({
    name: 'limit',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'Giới hàn phải là số nguyên',
  })
  @IsPositive({
    message: 'Giới hạn phải lớn hơn 0',
  })
  limit?: number;

  //page
  @ApiPropertyOptional({
    name: 'page',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message: 'Trang phải là số nguyên',
  })
  @IsPositive({
    message: 'Trang phải lớn hơn 0',
  })
  page?: number;
}

export class findAdminDto extends FindDto {
  //status
  @ApiPropertyOptional({
    name: 'status',
    example: EVENT_STATUS.PUBLISHED,
  })
  @IsOptional()
  @IsIn(Object.values(EVENT_STATUS), {
    message: 'Event status phải thuộc: DRAFT, PUBLISHED, CANCELLED, ENDED',
  })
  status?: EventStatus;
}
