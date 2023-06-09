import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSchedulesCommentDto {
  @ApiProperty({ description: '댓글 내용', example: '이 일정을 추천합니다!' })
  @IsString({ message: '댓글 내용은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '댓글 내용은 비어있지 않아야 합니다.' })
  comment: string;
}
