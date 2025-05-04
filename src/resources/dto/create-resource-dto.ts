import { IsNotEmpty, IsString, IsOptional, IsInt, Min }
from 'class-validator';

export class CreateResourceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  quantity: number;
}