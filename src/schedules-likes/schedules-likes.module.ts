import { Module } from '@nestjs/common';
import { SchedulesLikesService } from './schedules-likes.service';
import { SchedulesLikesController } from './schedules-likes.controller';
import { SchedulesLikesRepository } from './schedules-likes.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesModule } from '../schedules/schedules.module';
import { SchedulesRepository } from '../schedules/schedules.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SchedulesLikesRepository]),
    SchedulesModule,
  ],
  controllers: [SchedulesLikesController],
  providers: [
    SchedulesLikesService,
    SchedulesLikesRepository,
    SchedulesRepository,
  ],
})
export class SchedulesLikesModule {}
