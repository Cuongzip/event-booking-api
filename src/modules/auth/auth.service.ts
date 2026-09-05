import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { RegisterDto } from './dtos/register.dto';
import { db } from '../../prisma/db.js';

@Injectable()
export class AuthService {
  async register(data: RegisterDto) {
    const { email, password } = data;
    const user = await db.orm.public.User.where({
      email,
    }).first();

    if (user)
      throw new ConflictException(
        'Email đã tồn tại vui lòng đăng ký với email khác',
      );

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    try {
      const { password: pa, ...rest } = await db.orm.public.User.create({
        ...data,
        password: hash,
      });
      return rest;
    } catch (error) {
      // handle race condition
    }
  }
}
