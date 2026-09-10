import {
  BadRequestException,
  HttpStatus,
  ParseIntPipe as NestParseIntPipe,
} from '@nestjs/common';

export function ParseIntPipe(message = 'Lỗi dữ liệu đầu vào') {
  return new NestParseIntPipe({
    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    exceptionFactory: () => new BadRequestException(message),
  });
}
