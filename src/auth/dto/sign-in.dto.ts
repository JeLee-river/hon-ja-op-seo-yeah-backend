import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  id: string;

  @IsString()
  password: string;
}
