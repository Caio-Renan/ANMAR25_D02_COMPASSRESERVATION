import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export function IsGenericDate() {
  return applyDecorators(
    IsNotEmpty(),
    Type(() => Date),
    IsDate()
  );
}