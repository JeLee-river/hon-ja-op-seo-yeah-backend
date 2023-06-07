import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
import { DestinationsCommentsService } from './destinations-comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUserFromAccessToken } from '../auth/get-user-from-access-token.decorator';
import { CreateDestinationsCommentDto } from './dto/create-destinations-comment.dto';
import { DestinationsComment } from './entities/destinations-comment.entity';

@ApiTags('여행지 리뷰 (Destinations Comments)')
@Controller('')
export class DestinationsCommentsController {
  constructor(
    private readonly destinationsCommentsService: DestinationsCommentsService,
  ) {}

  @Post('/destinations/:destinationId/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '여행지 리뷰 작성',
    description: '여행지에 대해 리뷰를 작성합니다.',
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
    summary: '특정 여행지의 리뷰 목록 조회',
    description: '특정 여행지의 리뷰 목록을 조회합니다.',
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
}
