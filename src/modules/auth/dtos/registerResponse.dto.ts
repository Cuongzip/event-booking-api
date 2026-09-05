import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterResponseDto {
  //id
  @ApiProperty({
    example: '1',
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
  name?: string;
  //role
  @ApiProperty({
    example: 'USER',
  })
  role!: string;
  //status
  @ApiProperty({
    example: 'active',
  })
  status!: string;

  //createdAt
  @ApiProperty({
    example: '2026-09-05 14:06:52.883317+07',
  })
  createdAt!: Date;
  //updatedAt
  @ApiProperty({
    example: '2026-09-05 14:06:52.883317+07',
  })
  updatedAt!: Date;
}
