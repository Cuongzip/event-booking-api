import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, MaxLength } from 'class-validator';

enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

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
  @IsEnum(UserRole)
  role?: UserRole;

  //status
  @ApiPropertyOptional({
    example: 'active',
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
