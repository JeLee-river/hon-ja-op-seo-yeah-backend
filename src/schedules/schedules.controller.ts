import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleDetail } from './entities/schedule-detail.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { GetUserFromCookie } from '../auth/get-user-from-cookie.decorator';

@Controller('schedules')
@ApiTags('여행 일정 (Schedules)')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '여행 일정을 생성한다.',
    description: '새로운 여행 일정을 생성한다.',
  })
  @ApiCreatedResponse({ description: '생성된 여행 일정' })
  createSchedule(
    @Req() request: Request,
    @Body(ValidationPipe) createScheduleDto: CreateScheduleDto,
    @GetUserFromCookie() userId: string,
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
