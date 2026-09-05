import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example: 'absf',
    description: 'Dùng để truy cập vào những tài nguyên yêu cầu xác thực',
  })
  accessToken!: string;
  @ApiProperty({
    example: 'absf',
    description: 'Dùng để lấy access token',
  })
  refreshToken!: string;
}
