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

export class CreateReservationResourceDto {
  @IsNotEmpty()
  @IsInt()
  resourceId: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateReservationResourceWrapperDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReservationResourceDto)
  create: CreateReservationResourceDto[];
}

export class CreateReservationDto {
  @IsNotEmpty()
  @IsInt()
  clientId: number;

  @IsNotEmpty()
  @IsInt()
  spaceId: number;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @Type(() => Date)
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsString()
  @IsIn(['OPEN', 'APPROVED', 'CLOSED', 'CANCELED'])
  status?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReservationResourceDto)
  resources: CreateReservationResourceDto[];
}
