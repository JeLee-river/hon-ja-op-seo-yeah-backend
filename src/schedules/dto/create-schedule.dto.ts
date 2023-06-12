import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScheduleStatus } from '../../types/ScheduleStatus.enum';

export class CreateScheduleDto {
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
}
