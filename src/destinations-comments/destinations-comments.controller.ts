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

import { DestinationsComment } from './entities/destinations-comment.entity';

import { DestinationsCommentsService } from './destinations-comments.service';

import { CreateDestinationsCommentDto } from './dto/create-destinations-comment.dto';
import { UpdateDestinationsCommentDto } from './dto/update-destinations-comment.dto';

import { GetUserFromAccessToken } from '../auth/decorators/get-user-from-access-token.decorator';

@ApiTags('여행지 댓글 (Destinations Comments)')
@Controller('')
export class DestinationsCommentsController {
  constructor(
    private readonly destinationsCommentsService: DestinationsCommentsService,
  ) {}

  @Post('/destinations/:destinationId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '여행지 댓글 작성',
    description: '여행지에 대해 댓글을 작성합니다.',
  })
  @ApiParam({
    name: 'destinationId',
    type: 'number',
    description: '여행지 ID 를 전달하세요.',
    example: 2877795,
  })
  @ApiBody({
    type: CreateDestinationsCommentDto,
    description: '댓글 내용을 입력하세요.',
  })
  @ApiCreatedResponse({ description: '등록된 댓글 및 사용자 정보' })
  createDestinationComment(
    @GetUserFromAccessToken() user,
    @Param('destinationId', ParseIntPipe) destinationId: number,
    @Body(ValidationPipe)
    createDestinationsCommentDto: CreateDestinationsCommentDto,
  ): Promise<DestinationsComment> {
    const result = this.destinationsCommentsService.createDestinationComment(
      user.id,
      destinationId,
      createDestinationsCommentDto,
    );
    return result;
  }

  @Get('/destinations/:destinationId/comments')
  @ApiOperation({
    summary: '특정 여행지의 댓글 목록 조회',
    description: '특정 여행지의 댓글 목록을 조회합니다.',
  })
  @ApiParam({
    name: 'destinationId',
    type: 'number',
    description: '여행지 ID 를 전달하세요.',
    example: 2877795,
  })
  @ApiOkResponse({
    description: '해당 여행지의 전체 댓글 목록',
    type: [DestinationsComment],
  })
  getCommentsByDestinationId(
    @Param('destinationId', ParseIntPipe) destinationId: number,
  ): Promise<DestinationsComment[]> {
    return this.destinationsCommentsService.getCommentsByDestinationId(
      destinationId,
    );
  }

  @Put('/destinations/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '여행지 댓글 내용을 수정합니다.',
    description: '여행지 댓글 내용을 수정합니다.',
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
  updateDestinationComment(
    @GetUserFromAccessToken() user,
    @Param('commentId', ParseIntPipe) comment_id: number,
    @Body(ValidationPipe)
    updateDestinationsCommentDto: UpdateDestinationsCommentDto,
  ): Promise<DestinationsComment> {
    return this.destinationsCommentsService.updateDestinationComment(
      user.id,
      comment_id,
      updateDestinationsCommentDto,
    );
  }

  @Delete('/destinations/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '여행지 댓글을 삭제합니다.',
    description: '여행지 댓글을 삭제합니다.',
  })
  @ApiParam({
    name: 'commentId',
    type: 'number',
    description: '삭제할 댓글 ID 를 전달하세요.',
    example: 4,
  })
  @ApiCreatedResponse({ description: '댓글 삭제 요청 성공 여부' })
  deleteDestinationComment(
    @GetUserFromAccessToken() user,
    @Param('commentId', ParseIntPipe) comment_id: number,
  ): Promise<{ message: string }> {
    return this.destinationsCommentsService.deleteDestinationComment(
      user.id,
      comment_id,
    );
  }

  // TODO : 로그인한 사용자가 작성한 댓글 전체 목록 조회하기 (여행지 포함)
  @Get('/destinations/comments/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '로그인한 사용자가 작성한 댓글 목록 및 여행지 정보를 조회한다.',
    description:
      '로그인한 사용자가 작성한 댓글 목록 및 여행지 정보를 조회합니다.',
  })
  @ApiOkResponse({
    description: '해당 사용자의 전체 댓글 목록',
    type: [DestinationsComment],
  })
  getCommentsByUserId(
    @GetUserFromAccessToken() user,
  ): Promise<DestinationsComment[]> {
    return this.destinationsCommentsService.getCommentsByUserId(user.id);
  }
}
