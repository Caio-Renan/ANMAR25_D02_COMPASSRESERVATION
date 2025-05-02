import { IsOptional, IsString, IsInt, Min } from "class-validator";
import { createSpaceDto } from "./create-space-dto";
import { PartialType } from "@nestjs/mapped-types";

export class updateSpaceDto extends PartialType (createSpaceDto) {
  
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