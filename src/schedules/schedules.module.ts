import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesRepository } from './schedules.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SchedulesRepository])],
  controllers: [SchedulesController],
  providers: [SchedulesService, SchedulesRepository],
})
export class SchedulesModule {}
