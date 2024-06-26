import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ScheduleStatus } from '../../types/ScheduleStatus.enum';

export class UpdateScheduleDto {
  @ApiProperty({ description: '기존에 등록된 여행 일정 ID', example: 12 })
  @IsNotEmpty({ message: 'schedule_id 는 비어있지 않아야 합니다.' })
  @IsNumber({}, { message: 'schedule_id 는 숫자여야 합니다.' })
  schedule_id: number;

  @ApiProperty({ description: '일정 제목', example: '영희의 우도 여행 #1' })
  @IsString()
  title: string;

  @ApiProperty({
    description: '한줄 소개',
    example: '1박2일로 떠나는 우도 여행',
  })
  @IsString()
  summary: string;

  @ApiProperty({ description: '여행 기간 (단위: 일)', example: 3 })
  @IsNumber()
  duration: number;

  @ApiProperty({ description: '여행 시작일', example: '2023-01-01' })
  @IsString()
  start_date: string;

  @ApiProperty({ description: '여행 종료일', example: '2023-01-02' })
  @IsString()
  end_date: string;

  @ApiProperty({ description: '공개 여부', example: 'PUBLIC | PRIVATE' })
  @IsString()
  status: ScheduleStatus;

  @ApiProperty({ description: '대표 이미지', example: 'base64 imagePath' })
  @IsString()
  image: string;

  destinations: number[][];
}
