import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthCredentialDto {
  @ApiProperty({ description: '이메일', example: 'user@example.com' })
  @IsEmail()
  id: string;

  @ApiProperty({ description: '비밀번호', example: 'user!1234' })
  @IsString()
  password: string;

  @ApiProperty({ description: '닉네임', example: '영희' })
  @IsString()
  nickname: string;

  @ApiProperty({ description: '생년월일', example: '2000-01-01' })
  @IsString()
  birth_date: string;

  @ApiProperty({ description: '전화번호', example: '010-1111-222' })
  @IsString()
  phone_number: string;

  @ApiProperty({ description: '성별', example: '여성' })
  @IsString()
  gender: string;

  @ApiProperty({ description: '프로필 이미지' })
  @IsString()
  profile_image: string;

  created_at: Date;
}
