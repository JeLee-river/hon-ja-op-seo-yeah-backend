import { DataSource, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesRepository extends Repository<Category> {
  constructor(private dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }

  async getAllCategories(): Promise<Category[]> {
    const categories = await this.find();

    return categories;
  }
}
