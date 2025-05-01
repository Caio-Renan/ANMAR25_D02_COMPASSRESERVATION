import { IsString } from "class-validator";
import { createSpaceDto } from "./create-space-dto";

export class deleteSpaceDto extends createSpaceDto {
  
    @IsString()
    id: string;
}