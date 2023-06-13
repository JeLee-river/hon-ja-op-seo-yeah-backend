import { Injectable } from '@nestjs/common';

import { DataSource, DeleteResult, Repository } from 'typeorm';

import { SchedulesLike } from './entities/schedules-like.entity';

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

  async deleteLikesByScheduleId(schedule_id: number): Promise<DeleteResult> {
    return await this.delete({ schedule_id });
  }

  async getScheduleIdsLikedByUser(user_id: string): Promise<SchedulesLike[]> {
    const query = this.createQueryBuilder('schedules_like')
      .select('schedules_like.schedule_id')
      .where('schedules_like.user_id = :user_id', { user_id })
      .andWhere('schedules_like.is_liked = :isLiked', { isLiked: true });

    return await query.getMany();
  }
}
