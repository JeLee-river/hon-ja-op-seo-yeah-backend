import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DestinationsLikesService } from './destinations-likes.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUserFromAccessToken } from '../auth/get-user-from-access-token.decorator';
import { DestinationsLike } from './entities/destinations-like.entity';

@ApiTags(`여행지 '좋아요' (Destinations Likes)`)
@Controller('')
export class DestinationsLikesController {
  constructor(
    private readonly destinationsLikesService: DestinationsLikesService,
  ) {}

  @Post('/destinations/:destinationId/likes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '여행지의 [좋아요] 를 설정/해제합니다.',
    description: '해당 여행지의 [좋아요] 를 설정/해제합니다.',
  })
  @ApiParam({
    name: 'destinationId',
    type: 'number',
    description: '여행지 ID 를 전달하세요.',
    example: 2877795,
  })
  @ApiOkResponse({
    description: '좋아요 설정/해제 요청 처리 결과',
    type: DestinationsLike,
  })
  toggleLikesForDestinations(
    @GetUserFromAccessToken() user,
    @Param('destinationId', ParseIntPipe) destination_id: number,
  ): Promise<Omit<DestinationsLike, 'idx'>> {
    return this.destinationsLikesService.toggleLikesForDestination(
      user.id,
      destination_id,
    );
  }
}
