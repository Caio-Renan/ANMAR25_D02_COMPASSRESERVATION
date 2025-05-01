import { IsString } from "class-validator";
import { createSpaceDto } from "./create-space-dto";
import { PartialType } from "@nestjs/mapped-types";

export class getSpaceDto extends PartialType (createSpaceDto) {
  
    @IsString()
    id: string;
}