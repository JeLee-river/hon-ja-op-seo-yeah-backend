import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { Destination } from './entities/destination.entity';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DestinationResponse } from '../utils/swagger/destination.response';

@Controller()
@ApiTags('여행지 (Destinations)')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get('/fetchData')
  @ApiOperation({
    summary: '공공데이터에서 제주도 여행지 정보를 조회한다.',
    description: '공공데이터에서 제주도 여행지 정보를 조회한다.',
  })
  @ApiNoContentResponse({ description: '여행지 정보가 DB에 등록된다.' })
  async fetchData(): Promise<void> {
    return await this.destinationsService.fetchData();
  }

  @Get('/destinations')
  @ApiOperation({ summary: '전체 여행지 목록을 조회한다.' })
  @ApiOkResponse({ type: DestinationResponse })
  getAllDestinations(): Promise<Destination[]> {
    return this.destinationsService.getAllDestinations();
  }

  @Get('/categories/:categoryId/destinations')
  @ApiOperation({ summary: '특정 카테고리의 여행지 목록을 조회한다.' })
  @ApiOkResponse({ type: Destination })
  getDestinationsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Destination[]> {
    return this.destinationsService.getDestinationsByCategory(categoryId);
  }

  @Get('/destinations/:destinationId')
  @ApiOperation({ summary: '특정 여행지의 상세 정보를 조회한다.' })
  getDestination(
    @Param('destinationId', ParseIntPipe) destinationId,
  ): Promise<Destination> {
    return this.destinationsService.getDestination(destinationId);
  }
}
