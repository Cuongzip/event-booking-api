import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterDto } from './dtos/register.dto.js';
import { RegisterResponseDto } from './dtos/registerResponse.dto.js';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Đăng ký',
    description: 'Tạo thông tin tài khoản trên hệ thống',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại thông tin tài khoản đã tạo',
    type: RegisterResponseDto,
  })
  @Post('register')
  async register(
    @Body(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    data: RegisterDto,
  ) {
    return {
      data: await this.authService.register(data),
      message: 'Đăng ký thành công',
    };
  }
}
