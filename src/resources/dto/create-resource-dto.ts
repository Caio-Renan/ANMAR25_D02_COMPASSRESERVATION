import { MaxLength, MinLength}
from 'class-validator';
import { IsValidInt, IsGenericString } from 'src/common/decorators';
export class CreateResourceDto {
  @IsGenericString()
  @MaxLength(60)
  @MinLength(3)
  name: string;
  
  @MaxLength(250)
  @IsGenericString()
  description: string;

  @IsValidInt()
  quantity: number;
}
