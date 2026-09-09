import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../../prisma/db.js';
import { UserResponseDto } from './dtos/user-response.dto.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';

@Injectable()
export class UsersService {
  async findById(id: number): Promise<UserResponseDto> {
    const user = await db.orm.public.User.where({
      id,
    }).first();
    if (!user) throw new NotFoundException('User không tồn tại');

    const { password, ...rest } = user;
    return rest;
  }

  async updateById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await db.orm.public.User.where({ id }).update({
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException('User không tồn tại');

    const { password, ...rest } = user;
    return rest;
  }
}
