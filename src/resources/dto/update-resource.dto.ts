import { IsNotEmpty, IsString, IsOptional, IsInt, Min } from 'class-validator';

export class UpdateResourceDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description: string;
}
