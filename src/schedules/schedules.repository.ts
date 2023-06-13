import { DataSource, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Schedule } from './entities/schedule.entity';

import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

import { ScheduleIdsOrderByLikesCount } from '../types/ScheduleIdsOrderByLikesCount.interface';
import { PaginationOptions } from '../types/PaginationOptions.interface';
import { ScheduleStatus } from '../types/ScheduleStatus.enum';

import * as config from 'config';

@Injectable()
export class SchedulesRepository extends Repository<Schedule> {
  constructor(private dataSource: DataSource) {
    super(Schedule, dataSource.createEntityManager());
  }

  async createSchedule(
    userId: string,
    createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    const schedule = this.create({ user_id: userId, ...createScheduleDto });

    await this.save(schedule);

    return schedule;
  }

  async updateSchedule(
    userId: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<Schedule> {
    const defaultImagePath = config.get('img').DEFAULT_BACKGROUND_IMG_PATH;

    const { image } = updateScheduleDto;

    if (!image) {
      updateScheduleDto.image = defaultImagePath;
    }

    const schedule = this.create({ user_id: userId, ...updateScheduleDto });

    await this.save(schedule);

    return schedule;
  }

  async getScheduleBasic(schedule_id: number): Promise<Schedule> {
    return await this.findOne({
      where: {
        schedule_id,
      },
    });
  }

  async getScheduleById(scheduleId: number): Promise<Schedule> {
    const query = this.createQueryBuilder('schedule')
      .select([
        'schedule.schedule_id',
        'schedule.title',
        'schedule.summary',
        'schedule.start_date',
        'schedule.end_date',
        'schedule.duration',
        'schedule.status',
        'schedule.image',
        'schedule.created_at',
        'schedule.updated_at',
      ])
      .where('schedule.schedule_id = :scheduleId', { scheduleId })
      .leftJoin('schedule.user', 'user')
      .addSelect([
        'user.id',
        'user.nickname',
        'user.phone_number',
        'user.profile_image',
      ])
      .leftJoin('schedule.schedules_comments', 'schedules_comments')
      .addSelect([
        'schedules_comments.comment_id',
        'schedules_comments.comment',
        'schedules_comments.created_at',
        'schedules_comments.updated_at',
      ])
      .leftJoin('schedules_comments.user', 'comments_user')
      .addSelect([
        'comments_user.id',
        'comments_user.nickname',
        'comments_user.profile_image',
      ])
      .leftJoinAndSelect('schedule.schedule_details', 'schedule_details')
      .leftJoinAndSelect('schedule_details.destination', 'destination')
      .leftJoin('schedule.schedules_likes', 'schedules_likes')
      .addSelect(['schedules_likes.is_liked'])
      .leftJoin('schedules_likes.user', 'schedule_likes_user')
      .addSelect([
        'schedule_likes_user.id',
        'schedule_likes_user.nickname',
        'schedule_likes_user.profile_image',
      ])
      .orderBy({
        'schedule_details.day': 'ASC',
        'schedule_details.tour_order': 'ASC',
      });

    return await query.getOne();
  }

  async deleteScheduleById(schedule_id: number): Promise<DeleteResult> {
    return await this.delete({ schedule_id });
  }

  // 전체 여행 일정을 좋아요와 댓글 모두 포함하여 조회한다.
  async getAllSchedulesWithLikesAndComments(): Promise<Schedule[]> {
    const query = this.createQueryBuilder('schedule')
      .select([
        'schedule.schedule_id',
        'schedule.title',
        'schedule.summary',
        'schedule.start_date',
        'schedule.end_date',
        'schedule.duration',
        'schedule.status',
        'schedule.image',
        'schedule.created_at',
        'schedule.updated_at',
      ])
      .where('status = :status', { status: 'PUBLIC' })
      .leftJoin('schedule.user', 'user')
      .addSelect([
        'user.id',
        'user.nickname',
        'user.phone_number',
        'user.profile_image',
      ])
      .leftJoin('schedule.schedules_comments', 'schedules_comments')
      .addSelect([
        'schedules_comments.comment_id',
        'schedules_comments.comment',
        'schedules_comments.created_at',
        'schedules_comments.updated_at',
      ])
      .leftJoin('schedules_comments.user', 'comments_user')
      .addSelect([
        'comments_user.id',
        'comments_user.nickname',
        'comments_user.profile_image',
      ])
      .leftJoinAndSelect('schedule.schedule_details', 'schedule_details')
      .leftJoinAndSelect('schedule_details.destination', 'destination')
      .leftJoin('schedule.schedules_likes', 'schedules_likes')
      .addSelect(['schedules_likes.is_liked'])
      .leftJoin('schedules_likes.user', 'schedule_likes_user')
      .addSelect([
        'schedule_likes_user.id',
        'schedule_likes_user.nickname',
        'schedule_likes_user.profile_image',
      ])
      .orderBy({
        'schedule_details.day': 'ASC',
        'schedule_details.tour_order': 'ASC',
      });

    return await query.getMany();
  }

  // 전체 여행 일정을 좋아요와 댓글 모두 포함하여 조회한다.
  async getSchedulesByScheduleIds(scheduleIds: number[]): Promise<Schedule[]> {
    const query = this.createQueryBuilder('schedule')
      .select([
        'schedule.schedule_id',
        'schedule.title',
        'schedule.summary',
        'schedule.start_date',
        'schedule.end_date',
        'schedule.duration',
        'schedule.status',
        'schedule.image',
        'schedule.created_at',
        'schedule.updated_at',
      ])
      .where('status = :status', { status: 'PUBLIC' })
      .andWhere('schedule.schedule_id IN (:...scheduleIds)', {
        scheduleIds,
      })
      .leftJoin('schedule.user', 'user')
      .addSelect([
        'user.id',
        'user.nickname',
        'user.phone_number',
        'user.profile_image',
      ])
      .leftJoin('schedule.schedules_comments', 'schedules_comments')
      .addSelect([
        'schedules_comments.comment_id',
        'schedules_comments.comment',
        'schedules_comments.created_at',
        'schedules_comments.updated_at',
      ])
      .leftJoin('schedules_comments.user', 'comments_user')
      .addSelect([
        'comments_user.id',
        'comments_user.nickname',
        'comments_user.profile_image',
      ])
      .leftJoinAndSelect('schedule.schedule_details', 'schedule_details')
      .leftJoinAndSelect('schedule_details.destination', 'destination')
      .leftJoin('schedule.schedules_likes', 'schedules_likes')
      .addSelect(['schedules_likes.is_liked'])
      .leftJoin('schedules_likes.user', 'schedule_likes_user')
      .addSelect([
        'schedule_likes_user.id',
        'schedule_likes_user.nickname',
        'schedule_likes_user.profile_image',
      ])
      .orderBy({
        'schedule_details.day': 'ASC',
        'schedule_details.tour_order': 'ASC',
      });

    return await query.getMany();
  }

  async getSchedulesByUserId(user_id: string): Promise<Schedule[]> {
    const query = this.createQueryBuilder('schedule')
      .select([
        'schedule.schedule_id',
        'schedule.title',
        'schedule.summary',
        'schedule.start_date',
        'schedule.end_date',
        'schedule.duration',
        'schedule.status',
        'schedule.image',
        'schedule.created_at',
        'schedule.updated_at',
      ])
      .where('schedule.user_id = :user_id', { user_id })
      .leftJoin('schedule.user', 'user')
      .addSelect([
        'user.id',
        'user.nickname',
        'user.phone_number',
        'user.profile_image',
      ])
      .leftJoin('schedule.schedules_comments', 'schedules_comments')
      .addSelect([
        'schedules_comments.comment_id',
        'schedules_comments.comment',
        'schedules_comments.created_at',
        'schedules_comments.updated_at',
      ])
      .leftJoin('schedules_comments.user', 'comments_user')
      .addSelect([
        'comments_user.id',
        'comments_user.nickname',
        'comments_user.profile_image',
      ])
      .leftJoinAndSelect('schedule.schedule_details', 'schedule_details')
      .leftJoinAndSelect('schedule_details.destination', 'destination')
      .leftJoin('schedule.schedules_likes', 'schedules_likes')
      .addSelect(['schedules_likes.is_liked'])
      .leftJoin('schedules_likes.user', 'schedule_likes_user')
      .addSelect([
        'schedule_likes_user.id',
        'schedule_likes_user.nickname',
        'schedule_likes_user.profile_image',
      ])
      .orderBy({
        'schedule_details.day': 'ASC',
        'schedule_details.tour_order': 'ASC',
      });

    return await query.getMany();
  }

  /**
   * 메인 화면에서 사용할 [여행 일정 좋아요 순 랭킹]
   * @param count
   */
  async getSchedulesRanking(count: number): Promise<Schedule[]> {
    const query = this.createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.schedules_likes', 'schedules_likes')
      .select([
        'schedule.schedule_id',
        'schedule.user_id',
        'schedule.title',
        'schedule.summary',
        'schedule.duration',
        'schedule.start_date',
        'schedule.end_date',
        'schedule.status',
        'schedule.image',
        'schedule.created_at',
        'schedule.updated_at',
        'COUNT(CASE WHEN schedules_likes.is_liked = TRUE THEN 1 END) as likes_count',
      ])
      .groupBy('schedule.schedule_id')
      .orderBy('likes_count', 'DESC')
      .limit(count);

    return await query.getRawMany();
  }

  async updateScheduleBackgroundImage(
    schedule_id: number,
    imagePath: string,
  ): Promise<UpdateResult> {
    return await this.createQueryBuilder('schedule')
      .update(Schedule)
      .set({ image: imagePath })
      .where('schedule_id = :schedule_id', { schedule_id })
      .execute();
  }

  async getPublicScheduleIdsOrderByLikesCount(
    paginationOptions: PaginationOptions,
  ): Promise<ScheduleIdsOrderByLikesCount[]> {
    const { limit, offset } = paginationOptions;

    const query = this.createQueryBuilder('schedule')
      .leftJoin(
        'schedule.schedules_likes',
        'schedules_like',
        'schedule.schedule_id = schedules_like.schedule_id',
      )
      .select('schedule.schedule_id', 'schedule_id')
      .addSelect(
        'COUNT(case when schedules_like.is_liked = true then 1 end)',
        'likes_count',
      )
      .groupBy('schedule.schedule_id')
      .orderBy({
        likes_count: 'DESC',
        schedule_id: 'DESC',
      })
      .limit(limit)
      .offset(offset);

    return await query.getRawMany();
  }

  async getPublicSchedulesIdsOrderByLatestCreatedDate(
    paginationOptions: PaginationOptions,
  ): Promise<ScheduleIdsOrderByLikesCount[]> {
    const { limit, offset } = paginationOptions;

    const query = this.createQueryBuilder('schedule')
      .select('schedule.schedule_id', 'schedule_id')
      .orderBy({
        'schedule.created_at': 'DESC',
      })
      .limit(limit)
      .offset(offset);

    return await query.getRawMany();
  }

  async getTotalPublicScheduleCount(): Promise<number> {
    return await this.count({
      where: {
        status: ScheduleStatus.PUBLIC,
      },
    });
  }
}
