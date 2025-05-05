import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export function IsCustomPassword() {
  return applyDecorators(
    IsNotEmpty(),
    Length(8, 64),
    Transform(({ value }) =>
      typeof value === 'string' ? value.trim() : value,
    ),
    Matches(/^\S*$/, {
      message: 'Password should not contain spaces.',
    }),
    Matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/, {
      message: 'Password must contain letters and numbers.',
    }),
  );
}
