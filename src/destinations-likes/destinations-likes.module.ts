import { Module } from '@nestjs/common';
import { DestinationsLikesService } from './destinations-likes.service';
import { DestinationsLikesController } from './destinations-likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinationsLikesRepository } from './destinations-likes.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DestinationsLikesRepository])],
  controllers: [DestinationsLikesController],
  providers: [DestinationsLikesService, DestinationsLikesRepository],
})
export class DestinationsLikesModule {}
