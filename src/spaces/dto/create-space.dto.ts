import { MinLength, MaxLength } from "class-validator";
import { IsValidInt, IsGenericString } from 'src/common/decorators';
export class CreateSpaceDto {
  @IsGenericString()
  @MinLength(3)
  @MaxLength(60)
  name: string;

  @IsGenericString()
  @MaxLength(250)
  description: string;

  @IsValidInt()
  capacity: number;
}