
import { Status } from "@prisma/client";
import { IsEnum, IsOptional } from "class-validator";
import { IsValidInt, IsGenericString } from 'src/common/decorators';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Type } from "class-transformer";
export class FilterSpaceDto extends PaginationDto {
    
    @IsOptional()
    @IsGenericString()
    name?: string;
    
    @IsOptional()
    @Type(() => Number)
    @IsValidInt()
    capacity?: number;

    @IsOptional()
    @IsEnum(Status)
    status?: Status;

}


