import { IsNotEmpty, IsString, IsOptional, IsInt, Min, MaxLength, MinLength }
from 'class-validator';

export class CreateResourceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  description: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  quantity: number;
}