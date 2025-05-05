import { Type, Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateReservationDto {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  @IsIn(['OPEN', 'APPROVED', 'CLOSED', 'CANCELED'])
  status?: string;
}
