import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSchedulesCommentDto {
  @ApiProperty({
    description: '수정할 댓글 내용',
    example: '여기 정말 좋아요!',
  })
  @IsString({ message: '댓글 내용은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '댓글 내용은 비어 있지 않아야 합니다.' })
  comment: string;
}
