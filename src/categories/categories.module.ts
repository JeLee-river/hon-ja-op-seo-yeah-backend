import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesRepository])],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
