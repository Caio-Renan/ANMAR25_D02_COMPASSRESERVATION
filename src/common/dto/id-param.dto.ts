import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class IdParamDto {
  @Type(() => Number)
  @IsInt({ message: 'id must be an integer' })
  @Min(1, { message: 'id must be a positive number' })
  @Max(Number.MAX_SAFE_INTEGER, { message: `id must be less than ${Number.MAX_SAFE_INTEGER}` })
  id: number;
}