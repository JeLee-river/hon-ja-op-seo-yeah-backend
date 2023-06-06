import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

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
}
