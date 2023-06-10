import { IsNotEmpty, IsString } from 'class-validator';

export class CheckDuplicateNicknameDto {
  @IsString({ message: '닉네임은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '닉네임은 비어있지 않아야 합니다.' })
  nickname: string;
}
