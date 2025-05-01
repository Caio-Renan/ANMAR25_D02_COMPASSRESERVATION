import { IsString } from "class-validator";
import { createSpaceDto } from "./create-space-dto";

export class getSpaceDto extends createSpaceDto {
  
    @IsString()
    id: string;
}