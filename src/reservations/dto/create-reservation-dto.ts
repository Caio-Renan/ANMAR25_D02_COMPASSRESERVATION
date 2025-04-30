import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
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

export class CreateReservationDto {
  @IsNotEmpty()
  @IsInt()
  clientId: number;

  @IsNotEmpty()
  @IsInt()
  spaceId: number;

  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReservationResourceDto)
  resources: CreateReservationResourceDto[];
}
