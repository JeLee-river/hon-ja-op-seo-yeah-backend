import { IsInt, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteScheduleDto {
  @ApiProperty({ description: '기존에 등록된 여행 일정 ID', example: 12 })
  @IsNotEmpty({ message: 'schedule_id 는 비어있지 않아야 합니다.' })
  @IsInt({ message: 'schedule_id 는 숫자여야 합니다.' })
  schedule_id: number;
}
