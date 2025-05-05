import { IsNotEmpty, IsString, IsOptional, IsInt, Min, MaxLength, MinLength, Matches }
from 'class-validator';

export class CreateResourceDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  @MinLength(3)
  @Matches(/^$|^[a-zA-Z]{3,}( [a-zA-Z]+)*$/,{
    message: 'The name field cannot contain only spaces.'
  })
  name: string;

  @IsString()
  @MaxLength(60)
  @Matches(/^$|^[a-zA-Z]{3,}( [a-zA-Z]+)*$/,{
    message:'The description field must only contain letters from a to z.'
  })
  description: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  quantity: number;
}
