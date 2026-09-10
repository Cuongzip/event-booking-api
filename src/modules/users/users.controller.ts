import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { JwtPayload } from '../auth/types/jwt-payload.type.js';
import { User } from '../../common/decorators/user.decorator.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //Get: users/me
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy thông tin user',
    description: 'Lấy thông tin của mình',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại thông tin user đã tạo',
    type: UserResponseDto,
  })
  @ApiUnauthorizedResponse({
    description:
      'Lỗi xác thực do: (1) access token không được cung cấp, không hợp lệ hoặc hết hạn, (2) Mật khẩu hiện tại không chính xác',
  })
  @ApiNotFoundResponse({ description: 'User không tồn tại' })
  @Get('me')
  async findMe(@User() user: JwtPayload): Promise<{
    data: UserResponseDto;
  }> {
    return {
      data: await this.usersService.findById(user.sub),
    };
  }
  //Post: users/change-password
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Đổi mật khẩu',
  })
  @ApiOkResponse({
    description: 'Nhận lại thông báo thành công',
  })
  @ApiUnauthorizedResponse({ description: 'Mật khẩu hiện tại không chính xác' })
  @ApiNotFoundResponse({ description: 'User không tồn tại' })
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  async changePassword(
    @User() user: JwtPayload,
    @Body()
    changePasswordDto: ChangePasswordDto,
  ): Promise<{
    message: string;
  }> {
    await this.usersService.changePassword(user.sub, changePasswordDto);
    return {
      message: 'Thay đổi mật khẩu thành công',
    };
  }
}
