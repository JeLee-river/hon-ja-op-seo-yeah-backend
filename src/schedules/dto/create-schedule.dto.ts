import { IsNumber, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  title: string;

  @IsString()
  summary: string;

  @IsNumber()
  duration: number;

  @IsString()
  start_date: string;

  @IsString()
  end_date: string;

  @IsString()
  status: string;

  @IsString()
  image: string;

  detail?: number[][];
}
