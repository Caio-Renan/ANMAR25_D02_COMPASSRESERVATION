import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export function IsGenericString() {
  return applyDecorators(
    IsNotEmpty(),
    IsString(),
    Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
    ),
  );
}