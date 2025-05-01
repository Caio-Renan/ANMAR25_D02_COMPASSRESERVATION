import { IsString } from "class-validator";

export class getSpaceDto {
  
    @IsString()
    id: string;
}