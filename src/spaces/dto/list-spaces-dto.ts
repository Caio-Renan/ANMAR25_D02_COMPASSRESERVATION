import { Status } from "../../common/enums/status.enum";    
import { IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";

export class listSpaceDto{

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