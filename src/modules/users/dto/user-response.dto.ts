import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { UserStatus } from '../../../common/constants/user-status.constant.js';
import type { Role } from '../../../common/constants/role.constant.js';

export class UserResponseDto {
  //id
  @ApiProperty({
    example: 1,
  })
  id!: number;
  //email
  @ApiProperty({
    example: 'cuong@gmail.com',
  })
  email!: string;
  //name
  @ApiPropertyOptional({
    example: 'cuong',
  })
  name?: string | null;
  //role
  @ApiProperty({
    example: 'USER',
  })
  role!: Role;
  //status
  @ApiProperty({
    example: 'active',
  })
  status!: UserStatus;

  //createdAt
  @ApiProperty({
    example: '2026-09-05 14:06:52.883317+07',
  })
  createdAt!: string;
  //updatedAt
  @ApiProperty({
    example: '2026-09-05 14:06:52.883317+07',
  })
  updatedAt!: string;
}
