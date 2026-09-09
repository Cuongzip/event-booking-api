import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../types/jwt-payload.type.js';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeaders(request);
    if (!token) throw new UnauthorizedException('Token không hợp lệ');

    try {
      const secret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret,
      });

      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    return true;
  }

  extractTokenFromHeaders(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') || [];
    return type === 'Bearer' ? token : undefined;
  }
}
