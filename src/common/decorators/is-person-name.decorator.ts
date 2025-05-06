import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsString, MaxLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export function IsPersonName() {
  return applyDecorators(
    IsNotEmpty(),
    IsString(),
    MaxLength(100),
    Transform(({ value }) => {
      if (typeof value === 'string') {
        return value.replace(/\s+/g, ' ').trim();
      }
      return value;
    }),
    Matches(/^[A-Za-zÀ-ÿ\s.'-]+$/, {
      message:
        'Name must contain only letters, spaces, dots, apostrophes, or hyphens.',
    }),
  );
}