import { Module } from '@nestjs/common';
import { SchedulesCommentsService } from './schedules-comments.service';
import { SchedulesCommentsController } from './schedules-comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesCommentsRepository } from './schedules-comments.repository';
import { SchedulesRepository } from '../schedules/schedules.repository';
import { SchedulesModule } from '../schedules/schedules.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SchedulesCommentsRepository]),
    SchedulesModule,
  ],
  controllers: [SchedulesCommentsController],
  providers: [
    SchedulesCommentsService,
    SchedulesCommentsRepository,
    SchedulesRepository,
  ],
})
export class SchedulesCommentsModule {}
