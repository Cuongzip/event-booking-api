import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, MaxLength } from 'class-validator';
import { type Role, ROLE } from '../../../common/constants/role.constant.js';
import {
  USER_STATUSES,
  type UserStatus,
} from '../../../common/constants/user-status.constant.js';

export class UpdateUserDto {
  //name field
  @ApiPropertyOptional({
    example: 'Cuong',
    description: 'Tên người dùng',
  })
  @IsOptional()
  @MaxLength(500, {
    message: 'Tên phải có ít hơn 500 ký tự',
  })
  name?: string;

  //role
  @ApiPropertyOptional({
    example: 'USER',
  })
  @IsOptional()
  @IsIn(Object.values(ROLE), {
    message: 'Role phải thuộc: ADMIN, USER',
  })
  role?: Role;

  //status
  @ApiPropertyOptional({
    example: 'active',
  })
  @IsOptional()
  @IsIn(Object.values(USER_STATUSES), {
    message: 'User status phải thuộc: ACTIVE, INACTIVE, SUSPENDED',
  })
  status?: UserStatus;
}
