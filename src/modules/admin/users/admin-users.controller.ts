import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from '../../users/users.service.js';
import { UserResponseDto } from '../../users/dto/user-response.dto.js';
import { UpdateUserDto } from '../../users/dto/update-user.dto.js';

@ApiTags('admin/users')
@Controller({
  path: 'users',
  version: '1',
})
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

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
