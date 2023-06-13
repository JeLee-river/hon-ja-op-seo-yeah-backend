import { Injectable } from '@nestjs/common';

import { Category } from './entities/category.entity';

import { CategoriesRepository } from './categories.repository';
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
    categoryIds: string,
    title: string,
  ): Promise<{
    total_count: number;
    counts_by_category: ResponseCountByCategoryInterface[];
  }> {
    // 전체 카테고리 정보 조회
    const categories = await this.categoriesRepository.getAllCategories();

    let parsedCategoryIds;
    if (categoryIds === '') {
      // ! 선택한 카테고리가 아예 없는 경우 -> 선택된 카테고리가 아예 없다면 데이터를 전달하지 않는다.
      // ? -> [전체] 카테고리를 선택한 것과 다르다고 한다...
      return this.createCountsZeroPerCategory(categories);
    } else {
      parsedCategoryIds = categoryIds
        .split(',')
        .map(Number)
        .filter((number) => !isNaN(number));
    }

    // 검색 조건에 맞는 여행지 조회
    const countsByCategories =
      await this.destinationsRepository.getCountsFromSearchByCategory(
        parsedCategoryIds,
        title,
      );

    return this.transformCountsByCategory(categories, countsByCategories);
  }

  /**
   * 검색 시, 카테고리가 아무 것도 선택되지 않은 경우 검색 결과가 없음을 보여주기 위해
   * 모든 카테고리별 여행지 count 를 0으로 생성하여 전달한다.
   *
   * @param categories
   */
  createCountsZeroPerCategory(categories: Category[]): {
    total_count: number;
    counts_by_category: ResponseCountByCategoryInterface[];
  } {
    const counts_by_category = categories.map(({ id, name }) => {
      return {
        category_id: id,
        category_name: name,
        count: 0,
      };
    });

    return {
      total_count: 0,
      counts_by_category,
    };
  }

  /**
   * 여행지 검색 결과, 카테고리별 여행지 개수를 확인 및 변환한다.
   * - 검색 조건에 선택되지 않은 카테고리들의 여행지 개수를 0 으로 만들어주기 위함.
   * @param categories
   * @param countsByCategories
   */
  transformCountsByCategory(
    categories: Category[],
    countsByCategories: ResponseCountByCategoryInterface[],
  ) {
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
