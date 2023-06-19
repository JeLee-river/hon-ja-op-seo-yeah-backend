import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DestinationsByDayDto {
  @ApiProperty({
    description: '업데이트할 일자별 목적지 리스트',
    example: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
  })
  @IsNotEmpty({ message: 'destinations 는 비어있지 않아야 합니다.' })
  destinations: number[][];
}
