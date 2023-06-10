import { IsEmail, IsNotEmpty } from 'class-validator';

export class CheckDuplicateIdDto {
  @IsEmail({}, { message: '아이디는 이메일 형식이어야 합니다.' })
  @IsNotEmpty({ message: '이메일은 비어있지 않아야 합니다.' })
  id: string;
}
