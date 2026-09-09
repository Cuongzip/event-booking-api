import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, MaxLength } from 'class-validator';
import { Role } from '../../../common/enums/role.enum.js';
import { UserStatus } from '../../../common/enums/user-status.enum copy.js';

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
  @IsEnum(Role)
  role?: Role;

  //status
  @ApiPropertyOptional({
    example: 'active',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
