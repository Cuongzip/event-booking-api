import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto.js';
import { RegisterResponseDto } from './dto/register-response.dto.js';
import { LoginResponseDto } from './dto/login-response.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshTokenGuard } from './guards/refresh-token.guard.js';
import { User } from '../../common/decorators/user.decorator.js';
import type { JwtPayload } from './types/jwt-payload.type.js';
import { RefreshResponse } from './dto/refresh-response.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  //Post: auth/register
  @ApiOperation({
    summary: 'Đăng ký',
    description: 'Tạo thông tin tài khoản trên hệ thống',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại thông tin tài khoản đã tạo',
    type: RegisterResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email đã tồn tại',
  })
  @Public()
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
  //Post: auth/login
  @ApiOperation({
    summary: 'Đăng nhập',
    description: 'Đăng nhập vào hệ thống',
  })
  @ApiOkResponse({
    description: 'Nhận lại thông tin xác thực',
    type: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Email hoặc mật khẩu không chính xác',
  })
  @ApiForbiddenResponse({
    description: 'Tài khoản chưa kích hoạt hoặc bị chặn',
  })
  @HttpCode(HttpStatus.OK)
  @Public()
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
  //Post: auth/logout
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Đăng xuất',
    description: 'Đăng xuất phiên đăng nhập khỏi hệ thống hệ thống',
  })
  @ApiOkResponse({
    description: 'Nhận lại thông báo thành công',
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token không được cung cấp, không hợp lệ hoặc hết hạn',
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('logout')
  async logout(@User() user: JwtPayload): Promise<{ message: string }> {
    await this.authService.logout(user);
    return {
      message: 'Đăng xuất thành công',
    };
  }
  //Post: auth/refresh
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Cấp access token mới',
  })
  @ApiOkResponse({
    description: 'Nhận lại access token và refresh token',
    type: RefreshResponse,
  })
  @ApiForbiddenResponse({
    description: 'Tài khoản chưa kích hoạt hoặc bị chặn',
  })
  @ApiUnauthorizedResponse({
    description: 'Refresh token không được cung cấp, không hợp lệ hoặc hết hạn',
  })
  @ApiNotFoundResponse({
    description: 'User không tồn tại',
  })
  @HttpCode(HttpStatus.OK)
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refresh(
    @User() jwtPayload: JwtPayload,
  ): Promise<{ message: string; data: RefreshResponse }> {
    return {
      data: await this.authService.refresh(jwtPayload),
      message: 'Làm mới token thành công',
    };
  }
}
