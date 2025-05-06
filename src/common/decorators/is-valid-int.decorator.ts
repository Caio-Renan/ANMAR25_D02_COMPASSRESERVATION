import { applyDecorators } from '@nestjs/common';
import { IsInt, IsNotEmpty, Max, ValidationArguments, Min } from 'class-validator';
import { Type } from 'class-transformer';
  
  export function IsValidInt() {
    return applyDecorators(
      Min(1),
      Type(() => Number),
      IsNotEmpty({
        message: ({ property }: ValidationArguments) =>
            `${property} should not be empty`,
      }),
      IsInt({
        message: ({ property }: ValidationArguments) =>
          `${property} must be an integer number`,
      }),
      Max(Number.MAX_SAFE_INTEGER, {
        message: ({ property }: ValidationArguments) =>
          `${property} must be less than ${Number.MAX_SAFE_INTEGER}`,
      })
    );
  }
  