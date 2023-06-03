import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsEmail()
  user_id: string;

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
