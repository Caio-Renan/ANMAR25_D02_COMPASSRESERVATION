import { applyDecorators } from '@nestjs/common';
import { IsValidInt } from './is-valid-int.decorator';
export function IsValidId() {
  return applyDecorators(
    IsValidInt()
  );
}
