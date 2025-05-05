
import { Status } from "@prisma/client";
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { CreateSpaceDto } from "./create-space.dto";

export class ListSpaceDto extends PartialType(CreateSpaceDto){

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    name?: string;

    @IsInt()
    @IsOptional()
    @Min(1, { message: "Capacity must be at least 1" })
    capacity?: number;
    
    @IsEnum(Status)
    @IsOptional()
    status?: string;

    @IsInt()
    @IsOptional()
    @Min(1, { message: 'Page must be a positive integer' })
    page?: number;

    @IsInt()
    @IsOptional()
    pageSize?: number;

}


