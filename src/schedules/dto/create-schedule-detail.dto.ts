import { IsNumber, IsString } from 'class-validator';

export class CreateScheduleDetailDto {
  @IsNumber()
  schedule_id: number;

  @IsNumber()
  destination_id: number;

  @IsString()
  day: number;

  @IsNumber()
  tour_order: number;
}
