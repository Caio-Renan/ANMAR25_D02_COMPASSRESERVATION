import { IsInt, IsNotEmpty, IsString, Min } from "class-validator";


export class createSpaceDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  capacity: number;
}