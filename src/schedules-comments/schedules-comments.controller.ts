import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { SchedulesComment } from './entities/schedules-comment.entity';

import { SchedulesCommentsService } from './schedules-comments.service';

import { CreateSchedulesCommentDto } from './dto/create-schedules-comment.dto';
import { UpdateSchedulesCommentDto } from './dto/update-schedules-comment.dto';
import { UpdateDestinationsCommentDto } from '../destinations-comments/dto/update-destinations-comment.dto';

import { GetUserFromAccessToken } from '../auth/decorators/get-user-from-access-token.decorator';

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

  @Get('/schedules/:scheduleId/comments')
  @ApiOperation({
    summary: '특정 여행 일정의 댓글 목록 조회',
    description: '특정 여행 일정의 댓글 목록을 조회합니다.',
  })
  @ApiParam({
    name: 'scheduleId',
    type: 'number',
    description: '여행 ID 를 전달하세요.',
    example: 1,
  })
  @ApiOkResponse({
    description: '해당 여행 일의 전체 댓글 목록',
    type: [SchedulesComment],
  })
  getCommentsByScheduleId(
    @Param('scheduleId', ParseIntPipe) schedule_id: number,
  ): Promise<SchedulesComment[]> {
    return this.schedulesCommentsService.getCommentsByScheduleId(schedule_id);
  }

  @Get('/schedules/comments/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '로그인한 사용자가 여행 일정에 작성한 댓글 정보를 조회한다.',
    description:
      '로그인한 사용자가 여행 일정에 작성한 댓글 목록 및 여행 일정 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '해당 사용자의 전체 댓글 목록',
    type: [SchedulesComment],
  })
  getCommentsByUserId(
    @GetUserFromAccessToken() user,
  ): Promise<SchedulesComment[]> {
    return this.schedulesCommentsService.getCommentsByUserId(user.id);
  }

  @Put('/schedules/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '여행 일정에 작성된 댓글을 수정합니다.',
    description: '여행 일정에 작성된 댓글을 수정합니다.',
  })
  @ApiParam({
    name: 'commentId',
    type: 'number',
    description: '댓글 ID 를 전달하세요.',
    example: 4,
  })
  @ApiBody({
    type: UpdateDestinationsCommentDto,
    description: '수정할 댓글 내용',
  })
  @ApiCreatedResponse({ description: '수정된 댓글 정보' })
  updateScheduleComment(
    @GetUserFromAccessToken() user,
    @Param('commentId', ParseIntPipe) comment_id: number,
    @Body(ValidationPipe)
    updateSchedulesCommentDto: UpdateSchedulesCommentDto,
  ): Promise<SchedulesComment> {
    return this.schedulesCommentsService.updateScheduleComment(
      user.id,
      comment_id,
      updateSchedulesCommentDto,
    );
  }

  @Delete('/schedules/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '여행 일정 댓글을 삭제합니다.',
    description: '여행 일정 댓글을 삭제합니다.',
  })
  @ApiParam({
    name: 'commentId',
    type: 'number',
    description: '삭제할 댓글 ID 를 전달하세요.',
    example: 4,
  })
  @ApiCreatedResponse({ description: '댓글 삭제 요청 성공 여부' })
  deleteScheduleComment(
    @GetUserFromAccessToken() user,
    @Param('commentId', ParseIntPipe) comment_id: number,
  ): Promise<{ message: string }> {
    return this.schedulesCommentsService.deleteScheduleComment(
      user.id,
      comment_id,
    );
  }
}
