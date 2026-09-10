import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EventResponseDto } from './dto/event-response.dto.js';
import { CreateDto } from './dto/create.dto.js';
import { db } from '../../prisma/db.js';
import { UpdateDto } from './dto/update.dto.js';
import { executeWithUniqueSlug } from '../../utils/execute-with-unique-slug.js';
import { FindDto } from './dto/find.dto.js';
@Injectable()
export class EventsService {
  async findAll(findDto: FindDto): Promise<EventResponseDto[]> {
    const {
      keyword,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      limit = 10,
      page = 1,
    } = findDto;

    let query = db.orm.public.Event;

    if (keyword) {
      query = query.where((event) => event.title.ilike(`%${keyword}%`));
    }

    if (status) {
      query = query.where((event) => event.status.eq(status));
    }

    const skip = (page - 1) * limit;

    return await query
      .orderBy((event) => event[sortBy][sortOrder]())
      .limit(limit)
      .offset(skip)
      .all();
  }
  async findById(id: number): Promise<EventResponseDto> {
    const event = await db.orm.public.Event.where({
      id,
    }).first();

    if (!event) throw new NotFoundException('Event không tồn tại');
    return event;
  }

  async create(createDto: CreateDto): Promise<EventResponseDto> {
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

    return await executeWithUniqueSlug(
      title,
      'events_slug_key',
      async (slug: string) => {
        return await db.orm.public.Event.create({ ...createDto, slug });
      },
    );
  }

  async updateById(
    id: number,
    updateDto: UpdateDto,
  ): Promise<EventResponseDto> {
    const event = await db.orm.public.Event.where({
      id,
    }).first();

    if (!event) throw new NotFoundException('Event không tồn tại');

    const capacity = updateDto.capacity ?? event.capacity;
    const availableSeats = updateDto.availableSeats ?? event.availableSeats;
    const startAt = new Date(updateDto.startAt ?? event.startAt);
    const endAt = new Date(updateDto.endAt ?? event.endAt);
    const now = new Date();

    if (updateDto.startAt) {
      const newStartAt = new Date(updateDto.startAt);
      if (newStartAt <= now)
        throw new BadRequestException(
          'Thời gian bắt đầu phải lớn hơn thời gian hiên tại',
        );
    }
    if (startAt >= endAt)
      throw new BadRequestException(
        'Thời gian kết thúc phải lớn hơn thời gian bắt đầu',
      );

    if (capacity < availableSeats)
      throw new BadRequestException('Số chỗ trống không được lơn hơn sức chứa');

    const { title } = updateDto;
    if (!title)
      return (await db.orm.public.Event.where({ id }).update(updateDto))!;
    return (await executeWithUniqueSlug(
      title,
      'events_slug_key',
      async (slug: string) => {
        return await db.orm.public.Event.where({ id }).update({
          ...updateDto,
          slug,
        });
      },
    ))!;
  }

  async deleteById(id: number): Promise<void> {
    const result = await db.orm.public.Event.where({ id }).delete();
    if (result) throw new NotFoundException('Event không tồn tại');
  }
}
