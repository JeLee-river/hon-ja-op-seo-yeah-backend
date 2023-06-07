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
import { GetUserFromAccessToken } from '../auth/get-user-from-access-token.decorator';
import { ResponseScheduleInterface } from '../types/ResponseSchedule.interface';

@Controller()
@ApiTags('여행 일정 (Schedules)')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('schedules')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '여행 일정을 생성한다.',
    description: '새로운 여행 일정을 생성한다.',
  })
  @ApiCreatedResponse({ description: '생성된 여행 일정' })
  createSchedule(
    @Req() request: Request,
    @Body(ValidationPipe) createScheduleDto: CreateScheduleDto,
    @GetUserFromAccessToken() user,
  ): Promise<{
    schedule: Schedule;
    scheduleDetails: Omit<ScheduleDetail, 'idx'>[];
  }> {
    return this.schedulesService.createSchedule(user.id, createScheduleDto);
  }

  @Get('schedules')
  @ApiOperation({ summary: '전체 여행 일정을 조회한다.' })
  getAllSchedulesWithDetails(): Promise<Schedule[]> {
    return this.schedulesService.getAllSchedules();
  }

  @Get('schedules/:scheduleId')
  @ApiOperation({ summary: '특정 여행 일정을 상세 조회한다.' })
  getScheduleById(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<ResponseScheduleInterface> {
    return this.schedulesService.getScheduleById(scheduleId);
  }

  @Get('/ranking/schedules')
  @ApiOperation({ summary: '인기있는 여행 일정 TOP 10 을 조회한다.' })
  getSchedulesRanking(): Promise<Schedule[]> {
    return this.schedulesService.getSchedulesRanking();
  }
}
