import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { type EventStatus } from '../../../common/constants/event-status.constant.js';

export class CreateResponseDto {
  //id
  @ApiProperty({
    name: 'id',
    example: 1,
  })
  id!: number;

  //title
  @ApiProperty({
    name: 'title',
    example: 'Taylor Swift - The Eras Tour',
  })
  title!: string;

  //slug
  @ApiProperty({
    name: 'slug',
    example: 'taylor-swift-the-eras-tour',
  })
  slug!: string;

  //description
  @ApiPropertyOptional({
    name: 'description',
    example: 'Live concert',
  })
  description?: string | null;

  //capacity
  @ApiProperty({
    name: 'capacity',
    example: 100,
  })
  capacity!: number;

  //availableSeats
  @ApiProperty({
    name: 'availableSeats',
    example: 30,
  })
  availableSeats!: number;

  //location
  @ApiProperty({
    name: 'location',
    example: 'My Dinh National Stadium',
  })
  location!: string;

  //price
  @ApiProperty({
    name: 'price',
    example: 10000,
  })
  price!: number;

  //status
  @ApiPropertyOptional({
    name: 'status',
    example: 'DRAFT',
  })
  status?: EventStatus;

  //endAt
  @ApiProperty({
    name: 'endAt',
    example: '2026-09-05 14:06:52.883317+07',
  })
  endAt!: string;

  //startAt
  @ApiProperty({
    name: 'startAt',
    example: '2026-09-05 14:06:52.883317+07',
  })
  startAt!: string;

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
