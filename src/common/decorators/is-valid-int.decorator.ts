import { applyDecorators } from '@nestjs/common';
import { IsInt, Max, ValidationArguments } from 'class-validator';
  
  export function IsValidInt() {
    return applyDecorators(
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
  