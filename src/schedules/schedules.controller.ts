import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleDetail } from './entities/schedule-detail.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('schedules')
@ApiTags('여행 일정 (Schedules)')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @ApiOperation({
    summary: '여행 일정을 생성한다.',
    description: '새로운 여행 일정을 생성한다.',
  })
  @ApiCreatedResponse({ description: '생성된 여행 일정' })
  createSchedule(
    @Body(ValidationPipe) createScheduleDto: CreateScheduleDto,
  ): Promise<{
    schedule: Schedule;
    scheduleDetails: Omit<ScheduleDetail, 'idx'>[];
  }> {
    return this.schedulesService.createSchedule(createScheduleDto);
  }

  @Get()
  @ApiOperation({ summary: '전체 여행 일정을 조회한다.' })
  getAllSchedulesWithDetails(): Promise<Schedule[]> {
    return this.schedulesService.getAllSchedules();
  }

  @Get('/:scheduleId')
  @ApiOperation({ summary: '특정 여행 일정을 상세 조회한다.' })
  getScheduleById(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<Schedule> {
    return this.schedulesService.getScheduleById(scheduleId);
  }
}
