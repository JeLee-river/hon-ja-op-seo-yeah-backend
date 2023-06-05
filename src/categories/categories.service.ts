import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private categoriesRepository: CategoriesRepository) {}

  getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.getAllCategories();
  }
}
