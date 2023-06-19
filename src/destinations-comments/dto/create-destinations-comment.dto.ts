import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDestinationsCommentDto {
  @ApiProperty({ description: '댓글 내용', example: '여기 정말 좋아요!' })
  @IsString({ message: '댓글 내용은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '댓글 내용은 비어있지 않아야 합니다.' })
  comment: string;
}
