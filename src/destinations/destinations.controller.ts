import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { Destination } from './entities/destination.entity';
import {
  ApiExcludeEndpoint,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DestinationResponse } from '../utils/swagger/destination.response';

@Controller()
@ApiTags('여행지 (Destinations)')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get('/fetchData')
  @ApiExcludeEndpoint() // Swagger 에서 제외하는 데코레이터
  @ApiOperation({
    summary: '공공데이터에서 제주도 여행지 정보를 조회한다.',
    description: '공공데이터에서 제주도 여행지 정보를 조회한다.',
  })
  @ApiNoContentResponse({ description: '여행지 정보가 DB에 등록된다.' })
  async fetchData(): Promise<void> {
    return await this.destinationsService.insertDestinations();
  }

  // TODO: 여행지 검색 : 카테고리와 여행지명
  @Get('/destinations/search')
  @ApiOperation({ summary: '여행지 검색 (카테고리, 여행지 타이틀)' })
  @ApiQuery({
    name: 'categoryIds',
    type: 'string',
    description:
      '카테고리 ID를 콤마(,)로 전달하세요. (12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점)',
    example: '12,14',
  })
  @ApiQuery({
    name: 'title',
    type: 'string',
    description: '검색할 목적지 이름을 입력하세요.',
    example: '제주',
  })
  @ApiOkResponse({ type: DestinationResponse })
  searchDestinationsWithLikesAndComments(
    @Query('categoryIds') categoryIds = '',
    @Query('title') title = '',
  ): Promise<Destination[]> {
    return this.destinationsService.searchDestinationsWithLikesAndComments(
      categoryIds,
      title,
    );
  }

  // TODO: test 용 api : 여행지 조회 시 댓글, 좋아요 정보를 모두 조회한다.
  @Get('/destinations-with-likes-and-comments/:destinationId')
  @ApiOperation({ summary: '특정 여행지를 조회한다. (좋아요, 댓글 포함)' })
  @ApiOkResponse({ type: DestinationResponse })
  getAllDestinationWithLikesAndComments(
    @Param('destinationId', ParseIntPipe) destination_id: number,
  ): Promise<Destination[]> {
    return this.destinationsService.getDestinationWithLikesAndComments(
      destination_id,
    );
  }

  @ApiOperation({ summary: '여행지 랭킹을 요청한 갯수만큼 조회한다.' })
  @ApiQuery({
    name: 'count',
    type: 'number',
    description: '조회할 여행지 갯수',
    example: 10,
  })
  @ApiOkResponse({ type: DestinationResponse })
  @Get('/ranking/destinations')
  getDestinationsRanking(
    @Query('count', ParseIntPipe) count: number,
  ): Promise<Destination[]> {
    const result = this.destinationsService.getDestinationsRanking(count);
    return result;
  }
}
