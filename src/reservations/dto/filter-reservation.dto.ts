import { IsString, IsOptional, IsEnum, IsNotEmpty, MaxLength, Matches, IsPhoneNumber } from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto'
import { Transform } from 'class-transformer';
import { IsCpf, IsFormattedPhoneNumber, IsPersonName, IsGenericString } from 'src/common/decorators';
export class FilterReservationDto extends PaginationDto {
  @IsPersonName()
  @IsOptional()
  name?: string;

  @IsFormattedPhoneNumber()
  @IsOptional()
  phone?: string;

  @IsEnum(ReservationStatus)
  @IsOptional()
  status?: ReservationStatus;
  
  @IsGenericString()
  @IsOptional()
  spaceName?: string;

  @IsCpf()
  @IsOptional()
  cpf?: string;
}