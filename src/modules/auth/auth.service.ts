import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { RegisterDto } from './dtos/register.dto';
import { db } from '../../prisma/db.js';
import { LoginDto } from './dtos/login.dto.js';
import { ConfigService } from '@nestjs/config';
import { RegisterResponseDto } from './dtos/registerResponse.dto.js';
import { LoginResponseDto } from './dtos/loginResponse.dto.js';
import type { JwtPayload } from './types/jwtPayload.type.js';
import { randomUUID } from 'crypto';
import { hashToken } from '../../utils/hashToken.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<RegisterResponseDto> {
    const { email, password } = data;
    const user = await db.orm.public.User.where({
      email,
    }).first();

    if (user)
      throw new ConflictException(
        'Email đã tồn tại vui lòng đăng ký với email khác',
      );

    const hash = await bcrypt.hash(password, 10);
    try {
      const { password: pa, ...rest } = await db.orm.public.User.create({
        ...data,
        password: hash,
      });
      return rest;
    } catch (error) {
      throw error;
      // handle race condition
    }
  }

  async login(data: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = data;
    const user = await db.orm.public.User.where({
      email,
    }).first();

    const error = new UnauthorizedException(
      'Email hoặc mật khẩu không chính xác',
    );

    if (!user) throw error;

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw error;

    if (user.status === 'SUSPENDED' || user.status === 'INACTIVE')
      throw new ForbiddenException(
        'Tài khoản bạn chưa kích hoạt hoặc bị chặn vui lòng liên hệ admin',
      );

    const sessionId = randomUUID();
    const payload = {
      sub: user.id,
      sessionId,
    };

    const accessTokenSecret = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    );

    const refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: accessTokenSecret,
      expiresIn: '60m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshTokenSecret,
      expiresIn: '30d',
    });

    await db.orm.public.Session.create({
      id: sessionId,
      refreshToken: hashToken(refreshToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(user: JwtPayload): Promise<void> {
    await db.orm.public.Session.where({
      id: user.sessionId,
    }).delete();
  }

  async refresh(
    user: JwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { sessionId, sub, exp } = user;

    const payload = {
      sub: sub,
      sessionId: sessionId,
    };

    const refreshTokenSecret = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
    );

    const accessTokenSecret = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
    );

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: accessTokenSecret,
      expiresIn: '60m',
    });

    const refreshToken = await this.jwtService.signAsync(
      {
        ...payload,
        exp,
      },
      {
        secret: refreshTokenSecret,
      },
    );

    await db.orm.public.Session.where({
      id: sessionId,
    }).update({
      refreshToken: hashToken(refreshToken),
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
