import { IsString } from "class-validator";

export class deleteSpaceDto {
  
    @IsString()
    id: string;
}