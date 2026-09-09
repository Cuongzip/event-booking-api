import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  USER_STATUSES,
  type UserStatus,
} from '../../../common/constants/user-status.constant.js';

export class UpdateStatusDto {
  @ApiProperty({
    example: 'ACTIVE',
  })
  @IsIn(Object.values(USER_STATUSES), {
    message: 'User status phải thuộc: ACTIVE, INACTIVE, SUSPENDED',
  })
  status!: UserStatus;
}
