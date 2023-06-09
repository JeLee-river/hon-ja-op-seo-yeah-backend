import { Injectable } from '@nestjs/common';
import { SchedulesLike } from './entities/schedules-like.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SchedulesLikesRepository extends Repository<SchedulesLike> {
  constructor(private dataSource: DataSource) {
    super(SchedulesLike, dataSource.createEntityManager());
  }

  async findLikedSchedule(user_id: string, schedule_id: number) {
    return await this.findOne({
      where: {
        user_id,
        schedule_id,
      },
    });
  }

  async updateLikedSchedule(newLike: SchedulesLike) {
    return await this.save(newLike);
  }

  async createLikeForSchedule(user_id: string, schedule_id: number) {
    const like = this.create({
      user_id,
      schedule_id,
      is_liked: true,
    });

    return await this.save(like);
  }

  async getLikesCountOfSchedule(schedule_id: number): Promise<number> {
    return await this.createQueryBuilder('schedules_like')
      .where('schedules_like.schedule_id = :schedule_id', { schedule_id })
      .andWhere('schedules_like.is_liked = :isLiked', { isLiked: true })
      .getCount();
  }
}
