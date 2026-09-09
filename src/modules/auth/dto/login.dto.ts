import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class LoginDto {
  //email
  @ApiProperty({
    example: 'cuong@gmail.com',
    description: 'Email',
  })
  @IsNotEmpty({
    message: 'Email không được để trống',
  })
  @IsEmail(
    {},
    {
      message: 'Email không đúng định dạng',
    },
  )
  email!: string;

  //password
  @ApiProperty({
    example: '123456789',
    description: 'Mật khẩu',
  })
  @IsNotEmpty({
    message: 'Mật khẩu không được để trống',
  })
  @MinLength(8, {
    message: 'Mật khẩu phải có ít nhất 8 ký tự',
  })
  @MaxLength(500, {
    message: 'Mật khẩu phải có ít hơn 500 ký tự',
  })
  password!: string;
}
