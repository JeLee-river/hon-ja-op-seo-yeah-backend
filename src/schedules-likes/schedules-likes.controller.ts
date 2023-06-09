import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { SchedulesLikesService } from './schedules-likes.service';
import { SchedulesLike } from './entities/schedules-like.entity';
import { GetUserFromAccessToken } from '../auth/get-user-from-access-token.decorator';
import { SelfLikeExceptionFilter } from '../utils/filters/self-like.exception.filter';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResponseScheduleLikesInterface } from '../types/ResponseScheduleLikes.interface';

@ApiTags(`여행 일정 '좋아요' (Schedules Likes)`)
@Controller()
export class SchedulesLikesController {
  constructor(private readonly schedulesLikesService: SchedulesLikesService) {}

  @Post('/schedules/:scheduleId/likes')
  @UseGuards(JwtAuthGuard)
  @UseFilters(SelfLikeExceptionFilter)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '여행 일정의 [좋아요] 를 설정/해제합니다.',
    description: '해당 여행 일정의 [좋아요] 를 설정/해제합니다.',
  })
  @ApiParam({
    name: 'scheduleId',
    type: 'number',
    description: '여행 일정 ID 를 전달하세요.',
    example: 38,
  })
  @ApiOkResponse({
    description: '일정에 대한 좋아요 설정/해제 요청 처리 결과',
    type: SchedulesLike,
  })
  async toggleLikesForSchedules(
    @GetUserFromAccessToken() user,
    @Param('scheduleId', ParseIntPipe) schedule_id: number,
  ): Promise<ResponseScheduleLikesInterface> {
    return this.schedulesLikesService.toggleLikeForSchedule(
      user.id,
      schedule_id,
    );
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '로그인한 사용자가 해당 여행 일정에 좋아요를 했는지 확인한다.',
    description: '로그인한 사용자가 해당 여행 일정에 좋아요를 했는지 확인한다.',
  })
  @ApiParam({
    name: 'scheduleId',
    type: 'number',
    description: '여행 일정 ID 를 전달하세요.',
    example: 45,
  })
  @ApiOkResponse({
    description: '일정에 대한 좋아요 여부',
  })
  @Get('/schedules/:scheduleId/likes')
  @UseGuards(JwtAuthGuard)
  async hasUserLikedSchedule(
    @GetUserFromAccessToken() user,
    @Param('scheduleId', ParseIntPipe) schedule_id: number,
  ): Promise<ResponseScheduleLikesInterface> {
    return await this.schedulesLikesService.hasUserLikedSchedule(
      user.id,
      schedule_id,
    );
  }
}
