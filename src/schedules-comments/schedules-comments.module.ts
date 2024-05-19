import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { SchedulesCommentsController } from './schedules-comments.controller';
import { SchedulesCommentsService } from './schedules-comments.service';
import { SchedulesCommentsRepository } from './schedules-comments.repository';

import { SchedulesModule } from '../schedules/schedules.module';

import { SchedulesRepository } from '../schedules/schedules.repository';

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
