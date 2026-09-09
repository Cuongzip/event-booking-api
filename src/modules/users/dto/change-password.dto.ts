import { ApiProperty } from '@nestjs/swagger';
import { MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  //current password
  @ApiProperty({
    example: '123456789',
    description: 'Mật khẩu hiện tại',
  })
  @IsNotEmpty({
    message: 'Mật khẩu hiện tại không được để trống',
  })
  @MinLength(8, {
    message: 'Mật khẩu hiện tại phải có ít nhất 8 ký tự',
  })
  @MaxLength(500, {
    message: 'Mật khẩu hiện tại phải có ít hơn 500 ký tự',
  })
  currentPassword!: string;
  //new password
  @ApiProperty({
    example: '123456789',
    description: 'Mật khẩu mới',
  })
  @IsNotEmpty({
    message: 'Mật khẩu mới không được để trống',
  })
  @MinLength(8, {
    message: 'Mật khẩu mới phải có ít nhất 8 ký tự',
  })
  @MaxLength(500, {
    message: 'Mật khẩu mới phải có ít hơn 500 ký tự',
  })
  newPassword!: string;
}
