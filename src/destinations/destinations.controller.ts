import {
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { Destination } from './entities/destination.entity';
import {
  ApiExcludeEndpoint,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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

  @Get('/destinations')
  @ApiOperation({ summary: '전체 여행지 목록을 조회한다.' })
  @ApiOkResponse({ type: DestinationResponse })
  getAllDestinations(): Promise<Destination[]> {
    return this.destinationsService.getAllDestinations();
  }

  // TODO: 페이지네이션이 적용된 여행지 목록 조회 API
  @Get('/destinations-with-reviews')
  @ApiOperation({ summary: '전체 여행지 목록을 조회한다. (댓글 포함)' })
  @ApiOkResponse({ type: DestinationResponse })
  getAllDestinationsWithReview(
    @Query('page', ParseIntPipe) page: number,
    @Query('take', ParseIntPipe) take: number,
  ): Promise<Destination[]> {
    return this.destinationsService.getDestinationsWithReview(page, take);
  }

  // TODO: test 용 api : 여행지 목록 조회 시 댓글, 좋아요 정보를 모두 조회한다.
  @Get('/destinations-with-likes-and-comments')
  @ApiOperation({ summary: '전체 여행지 목록을 조회한다. (좋아요, 댓글 포함)' })
  @ApiOkResponse({ type: DestinationResponse })
  getAllDestinationsWithLikesAndComments(): Promise<Destination[]> {
    return this.destinationsService.getDestinationsWithLikesAndComments();
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
    @Query('categoryIds') categoryIds: string,
    @Query('title') title: string,
  ): Promise<Destination[]> {
    console.log('#####');
    console.log('categoryIds', categoryIds);
    console.log('title', title);
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

  @Get('/categories/destinations')
  @ApiOperation({
    summary: '선택한 카테고리들에 해당하는 여행지 목록을 조회한다.',
  })
  @ApiQuery({
    name: 'categoryIds',
    type: 'array',
    description:
      '카테고리 ID를 콤마(,)로 전달하세요. (12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점)',
    example: '?categoryIds=12,14',
  })
  @ApiOkResponse({ type: [Destination] })
  getDestinationsByCategory(
    @Query('categoryIds', new ParseArrayPipe({ items: Number }))
    categoryIds: number[],
  ): Promise<{ totalCount: number; result: Destination[] }> {
    return this.destinationsService.getDestinationsByCategoryIds(categoryIds);
  }

  @Get('/destinations/:destinationId')
  @ApiOperation({ summary: '특정 여행지의 상세 정보를 조회한다.' })
  @ApiParam({
    name: 'destinationId',
    type: 'number',
    description: '여행지 ID',
    example: 1887493,
  })
  getDestination(
    @Param('destinationId', ParseIntPipe) destinationId,
  ): Promise<Destination> {
    return this.destinationsService.getDestination(destinationId);
  }

  // TODO: 댓글을 포함한 여행지 목록 조회 API
  @Get('/destinations-with-reviews/:destinationId')
  @ApiOperation({ summary: '특정 여행지의 상세 정보를 조회한다. (댓글 포함)' })
  @ApiParam({
    name: 'destinationId',
    type: 'number',
    description: '여행지 ID',
    example: 1887493,
  })
  getDestinationWithReview(
    @Param('destinationId', ParseIntPipe) destinationId,
  ): Promise<any> {
    return this.destinationsService.getDestinationWithReview(destinationId);
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
