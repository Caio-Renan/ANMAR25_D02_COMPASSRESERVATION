import { IsInt, IsString, Min } from "class-validator";


export class createSpaceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  @Min(1)
  capacity: number;
}