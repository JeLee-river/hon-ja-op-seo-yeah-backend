import { Module } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { DestinationsController } from './destinations.controller';
import { DestinationsRepository } from './destinations.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DestinationsRepository])],
  controllers: [DestinationsController],
  providers: [DestinationsService, DestinationsRepository],
})
export class DestinationsModule {}
