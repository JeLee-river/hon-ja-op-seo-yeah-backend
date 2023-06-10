import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DestinationResponse } from '../utils/swagger/destination.response';
import { ResponseCountByCategoryInterface } from '../types/ResponseCountsByCategory.interface';

@Controller()
@ApiTags('여행지 카테고리 (Categories)')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/categories')
  @ApiOperation({
    summary: '전체 카테고리 조회',
    description: '전체 카테고리를 조회합니다.',
  })
  @ApiOkResponse({ description: '조회된 전체 카테고리 목록', type: Category })
  getAllCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories();
  }

  @Get('/categories/search-counts')
  @ApiOperation({
    summary: '검색한 여행지들이 카테고리별로 몇 개인지 개수 구하기',
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
    description: '조건에 맞는 여행지 목록으로 카테고리별 개수를 구합니다.',
    type: DestinationResponse,
  })
  getCountsFromSearchByCategory(
    @Query('categoryIds') categoryIds = '',
    @Query('title') title = '',
  ): Promise<{
    total_count: number;
    counts_by_category: ResponseCountByCategoryInterface[];
  }> {
    return this.categoriesService.getCountsFromSearchByCategory(
      categoryIds,
      title,
    );
  }
}
