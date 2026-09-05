import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterDto } from './dtos/register.dto.js';
import { RegisterResponseDto } from './dtos/registerResponse.dto.js';
import { LoginResponseDto } from './dtos/loginResponse.dto.js';
import { LoginDto } from './dtos/login.dto.js';

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
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Đăng nhập',
    description: 'Đăng nhập vào hệ thống',
  })
  @ApiOkResponse({
    description: 'Nhận lại thông tin xác thực',
    type: LoginResponseDto,
  })
  @Post('login')
  async login(
    @Body(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    data: LoginDto,
  ) {
    return {
      data: await this.authService.login(data),
      message: 'Đăng nhập thành công',
    };
  }
}
