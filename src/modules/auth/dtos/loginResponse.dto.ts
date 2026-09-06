import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiY3VvbmdAZ21haWwuY29tIiwiaWF0IjoxNzg4NjY2ODA2LCJleHAiOjE3ODg2NzA0MDZ9.JIL0aiuMv4PQ_zMxjLm1CK-z4IP2hbmP7qB2ijMrGNM',
    description: 'Dùng để truy cập vào những tài nguyên yêu cầu xác thực',
  })
  accessToken!: string;
  @ApiProperty({
    example:
      'gyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiY3VvbmdAZ21haWwuY29tIiwiaWF0IjoxNzg4NjY2ODA2LCJleHAiOjE3ODg2NzA0MDZ9.JIL0aiuMv4PQ_zMxjLm1CK-z4IP2hbmP7qB2ijMrGNM',
    description: 'Dùng để lấy access token',
  })
  refreshToken!: string;
}
