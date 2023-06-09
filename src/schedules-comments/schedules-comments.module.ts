import { Module } from '@nestjs/common';
import { SchedulesCommentsService } from './schedules-comments.service';
import { SchedulesCommentsController } from './schedules-comments.controller';

@Module({
  controllers: [SchedulesCommentsController],
  providers: [SchedulesCommentsService]
})
export class SchedulesCommentsModule {}
