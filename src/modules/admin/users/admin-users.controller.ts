import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UsersService } from '../../users/users.service.js';
import { UserResponseDto } from '../../users/dto/user-response.dto.js';
import { UpdateUserDto } from '../../users/dto/update-user.dto.js';
import { Roles } from '../../../common/decorators/roles.decorator.js';
import { UpdateStatusDto } from '../../users/dto/update-status.dto.js';
import { ROLE } from '../../../common/constants/role.constant.js';

@ApiTags('admin/users')
@ApiBearerAuth()
@Roles([ROLE.ADMIN])
@ApiForbiddenResponse({
  description: 'Bạn không có quyền thực hiện chức năng này',
})
@Controller({
  path: 'users',
  version: '1',
})
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}
  // Get: admin/users
  @ApiOperation({
    summary: 'Lấy danh sách user',
    description: 'Lấy danh sách user',
  })
  @ApiOkResponse({
    description: 'Nhận lại danh sách user',
    type: UserResponseDto,
    isArray: true,
  })
  @Get()
  async findAll(): Promise<{
    data: UserResponseDto[];
  }> {
    return {
      data: await this.usersService.findAll(),
    };
  }

  // Get: admin/users/:id
  @ApiOperation({
    summary: 'Lấy thông tin user',
    description: 'Lấy thông tin user bằng id',
  })
  @ApiOkResponse({
    description: 'Nhận lại thông tin user',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User không tồn tại',
  })
  @ApiUnauthorizedResponse({
    description: 'Access token không được cung cấp, không hợp lệ hoặc hết hạn',
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

  // Put: admin/user/:id
  @ApiOperation({
    summary: 'Cập nhật thông tin user',
    description: 'Cập nhật thông tin user theo id',
  })
  @ApiCreatedResponse({
    description: 'Nhận lại thông tin user mới update',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User không tồn tại',
  })
  @ApiUnauthorizedResponse({
    description:
      'Lỗi xác thực do: (1) access token không được cung cấp, không hợp lệ hoặc hết hạn, (2): mật khẩu hiện tại không chính xác',
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
    message: String;
  }> {
    return {
      data: await this.usersService.updateById(id, updateUserDto),
      message: 'Cập nhật thành công',
    };
  }

  // Patch: admin/users/:id/status
  @ApiOperation({
    summary: 'Cập nhật trạng thái user',
    description: 'Cập nhật trạng thái user',
  })
  @ApiOkResponse({
    description: 'Nhận lại thông tin user đã update',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'User không tồn tại',
  })
  @ApiUnauthorizedResponse({
    description: 'Access token không được cung cấp, không hợp lệ hoặc hết hạn',
  })
  @ApiParam({
    name: 'id',
    description: 'Mã user',
    example: '1',
  })
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body(
      new ValidationPipe({
        whitelist: true,
      }),
    )
    updateStatusDto: UpdateStatusDto,
  ): Promise<{
    data: UserResponseDto;
    message: string;
  }> {
    return {
      data: await this.usersService.updateStatus(id, updateStatusDto.status),
      message: 'Cập nhật thành công',
    };
  }
}
