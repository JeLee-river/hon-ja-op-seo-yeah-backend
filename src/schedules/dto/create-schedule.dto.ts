import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScheduleDto {
  @ApiProperty({ description: '일정 제목', example: '영희의 우도 여행 #1' })
  @IsString({ message: '일정 제목은 문자열이어야 합니다.' })
  @IsNotEmpty({ message: '일정 제목은 비어있지 않아야 합니다.' })
  title: string;

  @ApiProperty({
    description: '한줄 소개',
    example: '1박2일로 떠나는 우도 여행',
  })
  @IsNotEmpty({ message: '일정 한줄요약은 비어있지 않아야 합니다.' })
  @IsString({ message: '일정 한줄요약은 문자열이어야 합니다.' })
  summary: string;

  @ApiProperty({ description: '일정 기간 (단위: 일)', example: 3 })
  @IsNotEmpty({ message: '일정 기간은 비어있지 않아야 합니다.' })
  @IsNumber({}, { message: '일정 기간은 숫자이어야 합니다.' })
  @Min(1, { message: '일정 기간은 0보다 커야 합니다.' })
  duration: number;

  @ApiProperty({
    description: '일정 시작일',
    example: 'Fri Jun 09 2023 20:38:15 GMT+0900 (한국 표준시)',
  })
  @IsNotEmpty({ message: '일정 시작일은 비어있지 않아야 합니다.' })
  @IsString({ message: '일정 시작일은 문자열이어야 합니다.' })
  start_date: string;

  @ApiProperty({
    description: '일정 종료일',
    example: 'Fri Jun 16 2023 20:38:15 GMT+0900 (한국 표준시)',
  })
  @IsNotEmpty({ message: '일정 종료일은 비어있지 않아야 합니다.' })
  @IsString({ message: '일정 종료일은 문자열이어야 합니다.' })
  end_date: string;
}
