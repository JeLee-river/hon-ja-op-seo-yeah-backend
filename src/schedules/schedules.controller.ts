import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleDetail } from './entities/schedule-detail.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { GetUserFromAccessToken } from '../auth/get-user-from-access-token.decorator';
import { ResponseScheduleInterface } from '../types/ResponseSchedule.interface';
import { AuthCredentialDto } from '../auth/dto/auth-credential.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller()
@ApiTags('여행 일정 (Schedules)')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('schedules/basic')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '여행 일정의 기본 정보를 저장합니다.',
    description: '새로운 여행 일정의 기본 정보를 저장합니다.',
  })
  @ApiBody({
    type: CreateScheduleDto,
    description: '여행 일정의 기본 정보을 등록할 때 입력할 정보',
  })
  @ApiCreatedResponse({ description: '생성된 여행 일정' })
  createScheduleBasic(
    @Body(ValidationPipe) createScheduleDto: CreateScheduleDto,
    @GetUserFromAccessToken() user,
  ): Promise<Schedule> {
    return this.schedulesService.createScheduleBasic(
      user.id,
      createScheduleDto,
    );
  }

  @Put('schedules')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '여행 일정을 업데이트 합니다.',
    description: '여행 기본 일정을 업데이트하고 상세 일정을 등록합니다..',
  })
  @ApiBody({
    type: UpdateScheduleDto,
    description: '여행 일정 기본 정보 및 상세 일정',
  })
  @ApiCreatedResponse({ description: '업데이트된 여행 일정' })
  updateSchedule(
    @Body(ValidationPipe) updateScheduleDto: UpdateScheduleDto,
    @GetUserFromAccessToken() user,
  ): Promise<{
    schedule: Schedule;
    scheduleDetails: Omit<ScheduleDetail, 'idx'>[];
  }> {
    return this.schedulesService.updateSchedule(user.id, updateScheduleDto);
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
  @ApiQuery({
    name: 'count',
    type: 'number',
    description: '조회할 여행 일정 갯수',
    example: 10,
  })
  @ApiOperation({ summary: '여행 일정 랭킹을 요청한 갯수만큼 조회한다.' })
  getSchedulesRanking(
    @Query('count', ParseIntPipe) count: number,
  ): Promise<Schedule[]> {
    return this.schedulesService.getSchedulesRanking(Number(count));
  }
}
