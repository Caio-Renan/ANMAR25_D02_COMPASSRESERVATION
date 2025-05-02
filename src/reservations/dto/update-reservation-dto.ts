import { Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  IsIn,
  IsNotEmpty,
} from 'class-validator';

export class UpdateReservationDto {
  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  @IsIn(['OPEN', 'APPROVED', 'CLOSED', 'CANCELED'])
  status?: string;
}
