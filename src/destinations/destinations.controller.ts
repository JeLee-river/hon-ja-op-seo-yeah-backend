import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { Destination } from './entities/destination.entity';
import {
  ApiExcludeEndpoint,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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

  @Get('/categories/:categoryId/destinations')
  @ApiOperation({ summary: '특정 카테고리의 여행지 목록을 조회한다.' })
  @ApiParam({
    name: 'categoryId',
    type: 'string',
    description:
      '카테고리 ID (12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점)',
    example: '12',
  })
  @ApiOkResponse({ type: Destination })
  getDestinationsByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<Destination[]> {
    return this.destinationsService.getDestinationsByCategory(categoryId);
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
}
