import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPasswordDto {
  @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '비밀번호는 비어있지 않아야 합니다.' })
  password: string;
}
