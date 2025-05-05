import { IsOptional, IsEnum } from 'class-validator';
import { Status } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto'
import { IsGenericString } from 'src/common/decorators';
export class FilterResourcesDto extends PaginationDto {
  @IsOptional()
  @IsGenericString()
  name?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}