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
