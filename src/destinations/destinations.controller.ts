import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
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
  @ApiOperation({
    summary: '여행지 목록에서 검색하기 (카테고리, 여행지 타이틀)',
  })
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
  @ApiOkResponse({
    description:
      '조건에 맞는 여행지 목록을 댓글, 좋아요 정보와 함께 반환합니다.',
    type: DestinationResponse,
  })
  searchDestinationsWithLikesAndComments(
    @Query('categoryIds') categoryIds = '',
    @Query('title') title = '',
  ): Promise<Destination[]> {
    return this.destinationsService.searchDestinationsWithLikesAndComments(
      categoryIds,
      title,
    );
  }

  @Get('/destinations/:destinationId')
  @ApiOperation({ summary: '특정 여행지 정보 조회' })
  @ApiParam({
    name: 'destinationId',
    type: 'number',
    description: '여행지 ID 를 전달하세요.',
    example: 126456,
  })
  @ApiOkResponse({
    description: '해당 여행지 정보를 댓글, 좋아요 정보와 함께 반환합니다.',
    type: DestinationResponse,
  })
  getAllDestinationWithLikesAndComments(
    @Param('destinationId', ParseIntPipe) destination_id: number,
  ): Promise<Destination> {
    return this.destinationsService.getDestinationWithLikesAndComments(
      destination_id,
    );
  }

  @ApiOperation({ summary: '인기순 여행지 목록을 요청한 갯수만큼 조회한다.' })
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
    return this.destinationsService.getDestinationsRanking(count);
  }

  /**
   * TEST : 검색 + 페이지네이션
   * @param categoryIds
   * @param title
   * @param page
   * @param take
   */
  @Get('/test/destinations')
  @ApiOperation({
    summary: '여행지 목록에서 검색하기 (카테고리, 여행지 타이틀)',
  })
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
  @ApiQuery({
    name: 'page',
    type: 'number',
    description: '페이지 번호 (기본값: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'take',
    type: 'number',
    description: '한 페이지에 보여줄 목적지 개수 (기본값: 10)',
    example: 10,
  })
  @ApiOkResponse({
    description:
      '조건에 맞는 여행지 목록을 댓글, 좋아요 정보와 함께 반환합니다.',
    type: DestinationResponse,
  })
  searchDestinationsAndPagination(
    @Query('categoryIds') categoryIds = '',
    @Query('title') title = '',
    @Query('page') page = 1,
    @Query('take') take = 10,
  ): Promise<Destination[]> {
    return this.destinationsService.searchDestinationsAndPagination(
      categoryIds,
      title,
      Number(page),
      Number(take),
    );
  }
}
