import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsInt, Max } from 'class-validator';

export function IsValidInt() {
  return applyDecorators(
    IsNotEmpty(),
    IsInt(),
    Max(Number.MAX_SAFE_INTEGER, {
      message: `id must be less than ${Number.MAX_SAFE_INTEGER}`,
    })
  );
}