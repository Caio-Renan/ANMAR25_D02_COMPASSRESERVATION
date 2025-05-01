import { IsOptional, IsString, IsInt, Min } from "class-validator";

export class updateSpaceDto {
  
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1, { message: "Capacity must be at least 1" })
  @IsOptional()
  capacity?: number;
}