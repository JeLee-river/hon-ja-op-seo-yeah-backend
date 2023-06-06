import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesRepository } from './schedules.repository';
import { SchedulesDetailRepository } from './schedules-detail.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SchedulesRepository, SchedulesDetailRepository]),
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService, SchedulesRepository, SchedulesDetailRepository],
})
export class SchedulesModule {}
