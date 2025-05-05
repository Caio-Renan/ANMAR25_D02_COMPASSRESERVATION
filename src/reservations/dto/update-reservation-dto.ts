import { Type, Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsIn } from 'class-validator';
import { IsValidId, IsValidInt, IsGenericDate, IsGenericString } from 'src/common/decorators';
export class UpdateReservationDto {
  @IsOptional()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsGenericDate()
  startDate?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsGenericDate()
  endDate?: Date;

  @IsOptional()
  @IsGenericString()
  @IsIn(['OPEN', 'APPROVED', 'CLOSED', 'CANCELED'])
  status?: string;
}
