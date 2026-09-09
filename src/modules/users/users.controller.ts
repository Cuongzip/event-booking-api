import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { JwtPayload } from '../auth/types/jwt-payload.type.js';
import { User } from '../../common/decorators/user.decorator.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // get me
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông tin user',
    description: 'Lấy thông tin user bằng id của mình',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại thông tin tài khoản đã tạo',
    type: UserResponseDto,
  })
  @Get('me')
  @UseGuards(AccessTokenGuard)
  async findMe(@User() user: JwtPayload): Promise<{
    data: UserResponseDto;
  }> {
    return {
      data: await this.usersService.findById(user.sub),
    };
  }
}
