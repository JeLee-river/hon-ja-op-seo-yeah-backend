import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SchedulesCommentsService } from './schedules-comments.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUserFromAccessToken } from '../auth/get-user-from-access-token.decorator';
import { CreateSchedulesCommentDto } from './dto/create-schedules-comment.dto';
import { SchedulesComment } from './entities/schedules-comment.entity';

@ApiTags('여행 일정 댓글 (Schedules Comments)')
@Controller()
export class SchedulesCommentsController {
  constructor(
    private readonly schedulesCommentsService: SchedulesCommentsService,
  ) {}

  @Post('/schedules/:scheduleId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '여행 일정 댓글 작성',
    description: '여행 일정에 대해 댓글을 작성합니다.',
  })
  @ApiParam({
    name: 'scheduleId',
    type: 'number',
    description: '여행 일정 ID 를 전달하세요.',
    example: 45,
  })
  @ApiBody({
    type: CreateSchedulesCommentDto,
    description: '댓글 내용을 입력하세요.',
  })
  @ApiCreatedResponse({ description: '등록된 댓글 및 사용자 정보' })
  createScheduleComment(
    @GetUserFromAccessToken() user,
    @Param('scheduleId', ParseIntPipe) schedule_id: number,
    @Body(ValidationPipe)
    createSchedulesCommentDto: CreateSchedulesCommentDto,
  ): Promise<SchedulesComment> {
    const result = this.schedulesCommentsService.createScheduleComment(
      user.id,
      schedule_id,
      createSchedulesCommentDto,
    );
    return result;
  }
}
