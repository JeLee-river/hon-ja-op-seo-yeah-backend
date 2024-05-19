import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';

import { DestinationsModule } from '../destinations/destinations.module';
import { DestinationsRepository } from '../destinations/destinations.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriesRepository]),
    DestinationsModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, DestinationsRepository],
})
export class CategoriesModule {}
