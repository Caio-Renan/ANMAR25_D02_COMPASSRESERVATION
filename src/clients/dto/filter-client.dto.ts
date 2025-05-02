import { IsString, IsOptional, IsEnum, MaxLength, Matches } from 'class-validator';
import { Status } from '@prisma/client';
import { PaginationDTO } from '../../common/dto/pagination.dto';

export class FilterClientDto extends PaginationDTO {
  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Matches(/^[A-Za-zÀ-ÿ\s.'-]+$/, { message: 'name must contain only letters, spaces, dots, apostrophes, or hyphens.' })
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  email?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
