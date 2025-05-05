import { IsOptional, IsEnum, IsString, MaxLength } from 'class-validator';
import { Status } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { IsPersonName, IsCustomEmail } from 'src/common/decorators';

export class FilterClientDto extends PaginationDto {
  @IsOptional()
  @IsPersonName()
  name?: string;

  @IsOptional()
  @IsCustomEmail()
  email?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsString()
  @IsOptional()
  @MaxLength(14)
  cpf?: string;
}
