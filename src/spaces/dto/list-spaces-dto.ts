
import { Status } from "@prisma/client";
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { createSpaceDto } from "./create-space-dto";

export class ListSpaceDto extends PartialType(createSpaceDto){

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    @Min(1, { message: "Capacity must be at least 1" })
    capacity?: number;
    
    @IsEnum(Status)
    @IsOptional()
    status?: string;

    @IsInt()
    @IsOptional()
    page?: number;

    @IsInt()
    @IsOptional()
    pageSize?: number;

}


