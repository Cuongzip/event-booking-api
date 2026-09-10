import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { RegisterDto } from './dto/register.dto';
import { db } from '../../prisma/db.js';
import { LoginDto } from './dto/login.dto.js';
import { ConfigService } from '@nestjs/config';
import { RegisterResponseDto } from './dto/register-response.dto.js';
import { LoginResponseDto } from './dto/login-response.dto.js';
import type { JwtPayload } from './types/jwt-payload.type.js';
import { randomUUID } from 'crypto';
import { hashToken } from '../../utils/hash-token.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<RegisterResponseDto> {
    const { password } = data;

    const hash = await bcrypt.hash(password, 10);
    try {
      const { password: pa, ...rest } = await db.orm.public.User.create({
        ...data,
        password: hash,
      });
      return rest;
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'sqlState' in error &&
        error.sqlState === '23505' &&
        'constraint' in error &&
        error.constraint === 'users_email_key'
      )
        throw new ConflictException('Event slug đã tồn tại');
      throw error;
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
    jwtPayload: JwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { sessionId, sub, exp } = jwtPayload;

    const user = await db.orm.public.User.where({
      id: sub,
    }).first();

    if (!user) throw new NotFoundException('User không tồn tại');

    if (user.status === 'SUSPENDED' || user.status === 'INACTIVE')
      throw new ForbiddenException(
        'Tài khoản bạn chưa kích hoạt hoặc bị chặn vui lòng liên hệ admin',
      );

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
