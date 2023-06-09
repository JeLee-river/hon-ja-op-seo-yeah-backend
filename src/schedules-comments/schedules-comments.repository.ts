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

  async getCommentsByScheduleId(
    schedule_id: number,
  ): Promise<SchedulesComment[]> {
    const query = this.createQueryBuilder('schedules_comment')
      .select([
        'schedules_comment.comment_id',
        'schedules_comment.schedule_id',
        'schedules_comment.comment',
        'schedules_comment.created_at',
        'schedules_comment.updated_at',
      ])
      .where('schedule_id = :schedule_id', {
        schedule_id: schedule_id,
      })
      // TODO: 만약 특정 컬럼들만 조회하려면 다음과 같이 leftJoin, addSelect 로 나누어서 해야한다.
      .leftJoin('schedules_comment.user', 'user')
      .addSelect(['user.id', 'user.nickname', 'user.profile_image'])
      .orderBy({
        'schedules_comment.created_at': 'DESC',
      });

    return await query.getMany();
  }
}
