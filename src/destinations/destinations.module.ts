import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';
import { DestinationsRepository } from './destinations.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DestinationsRepository])],
  controllers: [DestinationsController],
  providers: [DestinationsService, DestinationsRepository],
})
export class DestinationsModule {}
