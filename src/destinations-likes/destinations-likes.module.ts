import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { DestinationsLikesController } from './destinations-likes.controller';
import { DestinationsLikesService } from './destinations-likes.service';
import { DestinationsLikesRepository } from './destinations-likes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DestinationsLikesRepository])],
  controllers: [DestinationsLikesController],
  providers: [DestinationsLikesService, DestinationsLikesRepository],
})
export class DestinationsLikesModule {}
