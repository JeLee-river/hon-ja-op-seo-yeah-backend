import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DestinationsCommentsService } from './destinations-comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateScheduleDto } from '../schedules/dto/create-schedule.dto';
import { GetUserFromAccessToken } from '../auth/get-user-from-access-token.decorator';
import { CreateDestinationsCommentDto } from './dto/create-destinations-comment.dto';
import { DestinationsComment } from './entities/destinations-comment.entity';

@ApiTags('여행지 리뷰 (Destinations Comments)')
@Controller('destinations-comments')
export class DestinationsCommentsController {
  constructor(
    private readonly destinationsCommentsService: DestinationsCommentsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '여행지 리뷰 작성',
    description: '여행지에 대해 리뷰를 작성합니다.',
  })
  @ApiBody({
    type: CreateScheduleDto,
    description: '여행지 리뷰를 등록할 때 입력할 정보',
  })
  @ApiCreatedResponse({ description: '등록된 댓글 정보' })
  createDestinationComment(
    @GetUserFromAccessToken() user,
    @Body(ValidationPipe)
    createDestinationsCommentDto: CreateDestinationsCommentDto,
  ): Promise<DestinationsComment> {
    // console.log('@@@@ Post Dest Comment @@@@');
    // console.log(user);
    // console.log(createDestinationsCommentDto);
    const result = this.destinationsCommentsService.createDestinationComment(
      user.id,
      createDestinationsCommentDto,
    );
    return result;
  }
}
