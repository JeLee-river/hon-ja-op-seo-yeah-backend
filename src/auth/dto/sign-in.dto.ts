import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ description: '이메일', example: 'user@example.com' })
  @IsEmail()
  id: string;

  @ApiProperty({ description: '비밀번호', example: 'user!1234' })
  @IsString()
  password: string;
}
