import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { db } from '../../prisma/db.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';

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

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await db.orm.public.User.where({ id }).first();

    if (!user) throw new BadRequestException('User không tổn tại');

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch)
      throw new UnauthorizedException('Mật khẩu hiện tại không chính xác');

    const hash = await bcrypt.hash(newPassword, 10);

    await db.orm.public.User.where({
      id,
    }).update({
      password: hash,
    });

    await db.orm.public.Session.where({
      userId: id,
    }).delete();
  }
}
