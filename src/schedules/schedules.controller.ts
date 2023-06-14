import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { ScheduleDetail } from './entities/schedule-detail.entity';
import { Schedule } from './entities/schedule.entity';

import { SchedulesService } from './schedules.service';

import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { DeleteScheduleDto } from './dto/delete-schedule.dto';
import { DestinationsByDayDto } from './dto/destinations-by-day.dto';

import { GetUserFromAccessToken } from '../auth/decorators/get-user-from-access-token.decorator';

import { ResponseScheduleInterface } from '../types/ResponseSchedule.interface';
import { ScheduleWithLikesAndComments } from '../types/ScheduleWithLikesAndComments.interface';

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
    description: '여행 기본 일정을 업데이트하고 상세 일정을 등록합니다.',
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
  @ApiOperation({ summary: '공개된 전체 여행 일정을 조회한다.' })
  @ApiOkResponse({
    description: '공개된 전체 여행 일정을 좋아요, 댓글 정보와 함께 조회한 목록',
  })
  getAllSchedulesWithLikesAndComments(): Promise<Schedule[]> {
    return this.schedulesService.getAllSchedulesWithLikesAndComments();
  }

  @Get('schedules/:scheduleId')
  @ApiOperation({ summary: '특정 여행 일정을 상세 조회한다.' })
  @ApiParam({
    name: 'scheduleId',
    type: 'number',
    description: '여행 일정 ID 를 전달하세요.',
    example: 45,
  })
  @ApiOkResponse({
    description: '선택한 여행 일정 정보 (좋아요, 댓글 정보 포함)',
  })
  getScheduleById(
    @Param('scheduleId', ParseIntPipe) scheduleId: number,
  ): Promise<ResponseScheduleInterface> {
    return this.schedulesService.getScheduleById(scheduleId);
  }

  @Delete('schedules/:scheduleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiParam({
    name: 'scheduleId',
    type: DeleteScheduleDto,
    description: '여행 일정 ID 를 전달하세요.',
    example: 24,
  })
  @ApiOperation({ summary: '특정 여행 일정을 삭제한다.' })
  @UsePipes(new ValidationPipe())
  deleteScheduleById(
    @Param('scheduleId', ParseIntPipe) schedule_id: number,
    @GetUserFromAccessToken() user,
  ): Promise<{ message: string }> {
    return this.schedulesService.deleteScheduleById(user.id, schedule_id);
  }

  @Get('/users/me/schedules')
  @ApiOperation({ summary: '로그인한 사용자가 작성한 일정들만 조회한다.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: '조회된 일정 목록', type: [Schedule] })
  getMySchedules(@GetUserFromAccessToken() user) {
    return this.schedulesService.getMySchedules(user.id);
  }

  @Get('users/me/liked-schedules')
  @ApiOperation({ summary: '로그인한 사용자가 좋아요 한 일정들만 조회한다.' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ description: '조회된 일정 목록', type: [Schedule] })
  getSchedulesLikedByUser(
    @GetUserFromAccessToken() user,
  ): Promise<Schedule[] | { message: string }> {
    return this.schedulesService.getSchedulesLikedByUser(user.id);
  }

  @Post('schedules/:scheduleId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '기존 여행 일정에 목적지를 추가한다.' })
  @ApiParam({
    name: 'scheduleId',
    type: 'string',
    description: '여행 일정 ID 를 전달하세요.',
    example: 24,
  })
  @ApiBody({
    type: DestinationsByDayDto,
    description: '일자별 목적지 ID 목록을 전달하세요.',
  })
  @ApiCreatedResponse({
    description: '업데이트된 여행 일자별 목적지 정보',
    type: [Schedule],
  })
  saveDestinationsForScheduleDetails(
    @Param('scheduleId', ParseIntPipe) schedule_id: number,
    @Body('destinations') destinations: number[][],
    @GetUserFromAccessToken() user,
  ): Promise<{
    destinationIds: number[][];
    destinationTitles: string[][];
  }> {
    return this.schedulesService.saveDestinationsForScheduleDetails(
      user.id,
      schedule_id,
      destinations,
    );
  }

  @Get('/ranking/schedules')
  @ApiQuery({
    name: 'count',
    type: 'number',
    description: '좋아요가 많은 순으로 여행 일정 랭킹을 조회합니다.',
    example: 10,
  })
  @ApiOperation({
    summary: '좋아요가 많은 순으로 여행 일정 랭킹을 조회합니다.',
  })
  getSchedulesRanking(
    @Query('count', ParseIntPipe) count: number,
  ): Promise<Schedule[]> {
    return this.schedulesService.getSchedulesRanking(Number(count));
  }

  @Get('/schedules/public/order/likes')
  @ApiOperation({
    summary:
      '공개된 전체 여행 일정을 좋아요 순으로 조회한다. (페이지네이션 적용)',
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    description: '페이지 번호 (기본값: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    description: '한 페이지에 보여줄 목적지 개수 (기본값: 10)',
    example: 10,
  })
  @ApiOkResponse({
    description: `공개된 전체 여행 일정을 좋아요, 댓글 정보와 함께 조회한 목록 (좋아요순) <br/><br/>
       (마지막 페이지 번호보다 큰 번호로 요청 시, 마지막 페이지 번호에 해당하는 일정들을 조회합니다.)`,
  })
  getPublicSchedulesOrderByLikesCount(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<ScheduleWithLikesAndComments[] | { message: string }> {
    return this.schedulesService.getPublicSchedulesOrderByLikesCount({
      page,
      limit,
    });
  }

  @Get('/schedules/public/order/latest-created-date')
  @ApiOperation({
    summary: '공개된 전체 여행 일정을 최신순으로 조회한다. (페이지네이션 적용)',
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    description: '페이지 번호 (기본값: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    description: '한 페이지에 보여줄 목적지 개수 (기본값: 10)',
    example: 10,
  })
  @ApiOkResponse({
    description: `공개된 전체 여행 일정을 좋아요, 댓글 정보와 함께 조회한 목록 (최신순) <br/><br/>
       (마지막 페이지 번호보다 큰 번호로 요청 시, 마지막 페이지 번호에 해당하는 일정들을 조회합니다.)`,
  })
  getPublicSchedulesOrderByLatestCreatedDate(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<ScheduleWithLikesAndComments[] | { message: string }> {
    return this.schedulesService.getPublicSchedulesOrderByLatestCreatedDate({
      page,
      limit,
    });
  }

  @Get('/schedules/public/count')
  @ApiOperation({
    summary: '공개된 전체 여행 일정의 개수를 조회한다.',
  })
  @ApiOkResponse({
    description:
      '공개된 전체 여행 일정을 좋아요, 댓글 정보와 함께 조회한 목록 (좋아요 순)',
  })
  getPublicSchedulesCount(): Promise<{ message: string }> {
    return this.schedulesService.getPublicSchedulesCount();
  }

  @Get('schedules/:scheduleId/is-author')
  @ApiExcludeEndpoint()
  @ApiOperation({
    summary: '로그인한 사용자가 현재 여행 일정의 작성인지 체크한다.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '로그인한 사용자가 작성자인지 여부',
    type: 'boolean',
  })
  isScheduleAuthor(
    @Param('scheduleId', ParseIntPipe) schedule_id: number,
    @GetUserFromAccessToken() user,
  ): Promise<{ isAuthor: boolean; message: string }> {
    return this.schedulesService.isScheduleAuthor(user.id, schedule_id);
  }
}
