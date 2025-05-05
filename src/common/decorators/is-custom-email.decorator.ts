import {
    applyDecorators,
  } from '@nestjs/common';
  import {
    IsNotEmpty,
    IsEmail,
    IsString,
    MaxLength,
  } from 'class-validator';
  import { Transform } from 'class-transformer';
  
  export function IsCustomEmail() {
    return applyDecorators(
      IsNotEmpty(),
      IsEmail(),
      IsString(),
      MaxLength(150),
      Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : value,
      ),
    );
  }
  