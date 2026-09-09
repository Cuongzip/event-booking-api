import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import type { JwtPayload } from '../auth/types/jwt-payload.type.js';
import { User } from '../../common/decorators/user.decorator.js';
import { UserResponseDto } from './dtos/user-response.dto.js';
import { AccessTokenGuard } from '../auth/guards/access-token.guard.js';
import { UpdateUserDto } from './dtos/update-user.dto.js';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get()
  findAll() {
    return 'test';
  }
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
  // find one
  @ApiOperation({
    summary: 'Lấy thông tin user',
    description: 'Lấy thông tin user bằng id',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại thông tin user',
    type: UserResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Mã user',
    example: '1',
  })
  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory(error) {
          return new BadRequestException('ID phải là số nguyên');
        },
      }),
    )
    id: number,
  ): Promise<{
    data: UserResponseDto;
  }> {
    return {
      data: await this.usersService.findById(id),
    };
  }

  // update one
  @ApiOperation({
    summary: 'Cập nhật thông tin user',
    description: 'Cập nhật thông tin user theo id',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại thông tin user mới update',
    type: UserResponseDto,
  })
  @ApiParam({
    name: 'id',
    description: 'Mã user',
    example: '1',
  })
  @Put(':id')
  async updateOne(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        exceptionFactory(error) {
          return new BadRequestException('ID phải là số nguyên');
        },
      }),
    )
    id: number,
    @Body(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    updateUserDto: UpdateUserDto,
  ): Promise<{
    data: UserResponseDto;
  }> {
    return {
      data: await this.usersService.updateById(id, updateUserDto),
    };
  }
}
