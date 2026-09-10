import { BadRequestException, Injectable } from '@nestjs/common';
import slugify from 'slugify';

import { CreateResponseDto } from './dto/create-response.dto.js';
import { CreateDto } from './dto/create.dto.js';
import { db } from '../../prisma/db.js';
@Injectable()
export class EventsService {
  async create(createDto: CreateDto): Promise<CreateResponseDto> {
    const { title, capacity, availableSeats, startAt, endAt } = createDto;
    const _startAt = new Date(startAt);
    const _endAt = new Date(endAt);
    const now = new Date();
    if (_startAt <= now)
      throw new BadRequestException(
        'Thời gian bắt đầu phải lớn hơn thời gian hiên tại',
      );

    if (_startAt >= _endAt)
      throw new BadRequestException(
        'Thời gian kết thúc phải lớn hơn thời gian bắt đầu',
      );

    if (capacity < availableSeats)
      throw new BadRequestException('Số chỗ trống không được lơn hơn sức chứa');

    const originSlug = slugify(title);
    let slug = originSlug;
    let suffix = 1;
    while (true) {
      try {
        const event = await db.orm.public.Event.create({ ...createDto, slug });
        return event;
      } catch (error) {
        if (
          error &&
          typeof error === 'object' &&
          'sqlState' in error &&
          error.sqlState === '23505' &&
          'constraint' in error &&
          error.constraint === 'events_slug_key'
        ) {
          suffix++;
          slug = originSlug + '-' + suffix;
          continue;
        }
        throw error;
      }
    }
  }
}
