import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { db } from '../../../prisma/db.js';
import { JwtPayload } from '../types/jwt-payload.type.js';
import { hashToken } from '../../../utils/hashToken.js';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeaders(request);
    if (!token)
      throw new UnauthorizedException('Refresh token không được cung cấp');

    let payload: JwtPayload;

    try {
      const secret = this.configService.get<string>('REFRESH_TOKEN_SECRET');

      payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });
    } catch {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }

    const session = await db.orm.public.Session.where({
      id: payload.sessionId,
    }).first();

    if (!session) throw new UnauthorizedException('Refresh token không hợp lệ');

    const isMatch = hashToken(token) === session.refreshToken;

    if (!isMatch) {
      await db.orm.public.Session.where({
        id: payload.sessionId,
      }).delete();
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }

    request['user'] = payload;

    return true;
  }

  extractTokenFromHeaders(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') || [];
    return type === 'Bearer' ? token : undefined;
  }
}
