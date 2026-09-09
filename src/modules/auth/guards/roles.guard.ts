import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../../../common/decorators/roles.decorator.js';
import { UsersService } from '../../users/users.service.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { sub } = request.user;
    const { role } = await this.userService.findById(sub);

    if (!roles.includes(role))
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện chức năng này',
      );

    return true;
  }
}
