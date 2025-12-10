import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsString()
  gender: string;

  @IsString()
  country: string;

  @IsString()
  hobbies: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
