import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleDetail } from './entities/schedule-detail.entity';

@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  createSchedule(
    @Body(ValidationPipe) createScheduleDto: CreateScheduleDto,
  ): Promise<{
    schedule: Schedule;
    scheduleDetails: Omit<ScheduleDetail, 'idx'>[];
  }> {
    return this.schedulesService.createSchedule(createScheduleDto);
  }

  @Get()
  getAllSchedules(): Promise<Schedule[]> {
    return this.schedulesService.getAllSchedules();
  }
}
