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
import { EVENT_STATUS } from '../../common/constants/event-status.constant.js';
@Injectable()
export class EventsService {
  async findAll(
    findDto: FindDto,
    isAdmin = false,
  ): Promise<EventResponseDto[]> {
    const {
      keyword,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      limit = 10,
      page = 1,
    } = findDto;

    let query = db.orm.public.Event;

    if (!isAdmin && status === EVENT_STATUS.DRAFT) return [];

    if (status) query = query.where({ status: status });

    if (keyword)
      query = query.where((event) => event.title.ilike(`%${keyword}%`));

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

  async publish(id: number): Promise<void> {
    const event = await db.orm.public.Event.where({
      id,
    }).first();

    if (!event) throw new NotFoundException('Event không tồn tại');

    const statusError = new BadRequestException(
      'Event chỉ có thể publish khi ở trạng thái draft',
    );
    if (event.status !== EVENT_STATUS.DRAFT) {
      throw statusError;
    }
    const result = await db.orm.public.Event.where({
      id,
      status: EVENT_STATUS.DRAFT,
    }).update({
      status: EVENT_STATUS.PUBLISHED,
    });

    if (!result) throw statusError;
  }

  async unpublish(id: number): Promise<void> {
    const event = await db.orm.public.Event.where({
      id,
    }).first();

    if (!event) throw new NotFoundException('Event không tồn tại');

    if (event.status !== EVENT_STATUS.PUBLISHED)
      throw new BadRequestException(
        'Event chỉ có thể unpublish khi ở trạng thái published',
      );

    const booking = await db.orm.public.Booking.where({ eventId: id }).first();

    if (booking)
      throw new BadRequestException(
        'Event đã được booking không thể unpublish',
      );

    //check thêm event đã dược booking chưa
    const result = await db.orm.public.Event.where({
      id,
      status: EVENT_STATUS.PUBLISHED,
    }).update({
      status: EVENT_STATUS.DRAFT,
    });

    if (!result)
      throw new BadRequestException(
        'Event không ở trạng thái PUBLISHED hoặc đã có booking',
      );
  }

  async cancel(id: number): Promise<void> {}

  async deleteById(id: number): Promise<void> {
    const result = await db.orm.public.Event.where({ id }).delete();
    if (result) throw new NotFoundException('Event không tồn tại');
  }
}
