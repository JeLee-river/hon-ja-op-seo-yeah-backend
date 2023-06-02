import { IsEmail, IsString } from 'class-validator';

export class AuthCredentialDto {
  @IsEmail()
  id: string;

  @IsString()
  password: string;

  @IsString()
  nickname: string;

  @IsString()
  birth_date: string;

  @IsString()
  phone_number: string;

  @IsString()
  gender: string;

  @IsString()
  profile_image: string;

  created_at: Date;
}
