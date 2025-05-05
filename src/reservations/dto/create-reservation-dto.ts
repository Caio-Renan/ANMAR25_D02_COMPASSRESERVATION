import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsValidId, IsValidInt, IsGenericDate, IsGenericString } from 'src/common/decorators';
export class CreateReservationResourceDto {
  @IsValidId()
  resourceId: number;

  @IsValidInt()
  quantity: number;
}

export class CreateReservationResourceWrapperDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReservationResourceDto)
  create: CreateReservationResourceDto[];
}

export class CreateReservationDto {
  @IsValidId()
  clientId: number;

  @IsValidInt()
  spaceId: number;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsGenericDate()
  startDate: Date;

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsGenericDate()
  endDate: Date;

  @IsOptional()
  @IsGenericString()
  @IsIn(['OPEN', 'APPROVED', 'CLOSED', 'CANCELED'])
  status?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReservationResourceDto)
  resources: CreateReservationResourceDto[];
}
