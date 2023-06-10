import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Category } from './entities/category.entity';
import { DestinationsRepository } from '../destinations/destinations.repository';
import { ResponseCountByCategoryInterface } from '../types/ResponseCountsByCategory.interface';

@Injectable()
export class CategoriesService {
  constructor(
    private categoriesRepository: CategoriesRepository,
    private destinationsRepository: DestinationsRepository,
  ) {}

  getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.getAllCategories();
  }

  // TODO: 여행지 검색 결과에서 카테고리별로 개수를 구한다.
  async getCountsFromSearchByCategory(
    categoryIds,
    title,
  ): Promise<{
    total_count: number;
    counts_by_category: ResponseCountByCategoryInterface[];
  }> {
    // categoryIds 를 배열로 변경
    let parsedCategoryIds;
    if (categoryIds === '') {
      parsedCategoryIds = [];
    } else {
      parsedCategoryIds = categoryIds
        .split(',')
        .map(Number)
        .filter((number) => !isNaN(number));
    }

    const countsByCategories =
      await this.destinationsRepository.getCountsFromSearchByCategory(
        parsedCategoryIds,
        title,
      );

    const categories = await this.categoriesRepository.getAllCategories();

    let total_count = 0;
    const counts_by_category = categories.map(({ id, name }) => {
      const matchedCategory = countsByCategories.find(
        (item) => id === item.category_id,
      );

      if (!matchedCategory) {
        return {
          category_id: id,
          category_name: name,
          count: 0,
        };
      }

      const matchedCount = Number(matchedCategory.count);
      total_count += matchedCount;

      return {
        category_id: id,
        category_name: name,
        count: matchedCount,
      };
    });

    return {
      total_count,
      counts_by_category,
    };
  }
}
