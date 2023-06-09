import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SchedulesComment } from './entities/schedules-comment.entity';
import { CreateSchedulesCommentDto } from './dto/create-schedules-comment.dto';

@Injectable()
export class SchedulesCommentsRepository extends Repository<SchedulesComment> {
  constructor(private dataSource: DataSource) {
    super(SchedulesComment, dataSource.createEntityManager());
  }

  async createScheduleComment(
    user_id: string,
    schedule_id: number,
    createSchedulesCommentDto: CreateSchedulesCommentDto,
  ) {
    const commentToCreated = this.create({
      user_id,
      schedule_id,
      ...createSchedulesCommentDto,
    });

    return await this.save(commentToCreated);
  }
}
