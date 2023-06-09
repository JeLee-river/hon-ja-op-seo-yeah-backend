import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';

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

  async getScheduleBasic(schedule_id: number): Promise<Schedule> {
    return await this.findOne({
      where: {
        schedule_id,
      },
    });
  }

  async getAllPublicSchedules(): Promise<Schedule[]> {
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
      ])
      .where('status = :status', { status: 'PUBLIC' })
      // TODO: 만약 특정 컬럼들만 조회하려면 다음과 같이 leftJoin, addSelect 로 나누어서 해야한다.
      .leftJoin('schedule.user', 'user')
      .addSelect([
        'user.id',
        'user.nickname',
        'user.phone_number',
        'user.profile_image',
      ])
      .leftJoinAndSelect('schedule.schedule_details', 'schedule_details')
      .leftJoinAndSelect('schedule_details.destination', 'destination')
      .leftJoin('schedule.schedules_likes', 'schedules_likes')
      .addSelect(['schedules_likes.is_liked'])
      .where('schedules_likes.is_liked = :isLiked', { isLiked: true })
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

    const result = await query.getMany();
    return result;
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
      ])
      .where('schedule.schedule_id = :scheduleId', { scheduleId })
      // TODO: 만약 특정 컬럼들만 조회하려면 다음과 같이 leftJoin, addSelect 로 나누어서 해야한다.
      .leftJoin('schedule.user', 'user')
      .addSelect([
        'user.id',
        'user.nickname',
        'user.phone_number',
        'user.profile_image',
      ])
      .leftJoinAndSelect('schedule.schedule_details', 'schedule_details')
      .leftJoinAndSelect('schedule_details.destination', 'destination')
      .leftJoin('schedule.schedules_likes', 'schedules_likes')
      .addSelect(['schedules_likes.is_liked'])
      .where('schedules_likes.is_liked = :isLiked', { isLiked: true })
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

    // .leftJoinAndSelect('schedule.schedule_details', 'schedule_details')
    // .leftJoinAndSelect('schedule_details.destination', 'destination')
    // .where('schedule.schedule_id = :scheduleId', { scheduleId })
    // .orderBy({
    //   'schedule_details.day': 'ASC',
    //   'schedule_details.tour_order': 'ASC',
    // });

    const result = await query.getOne();

    return result;
  }

  async deleteScheduleById(schedule_id: number): Promise<DeleteResult> {
    const result = await this.delete({ schedule_id });
    return result;
  }

  async getSchedulesRanking(count: number): Promise<Schedule[]> {
    const query = this.createQueryBuilder('schedule')
      .select([
        'schedule.user_id',
        'schedule.schedule_id',
        'schedule.title',
        'schedule.summary',
        'schedule.start_date',
        'schedule.end_date',
        'schedule.duration',
        'schedule.image',
      ])
      .where('schedule.status = :status', { status: 'PUBLIC' })
      .take(count)
      // TODO: 현재는 생성일자 기준 최신순이지만 좋아요 기능 구현 이후에는 좋아요 순으로 정렬해야 한다.
      .orderBy('schedule.created_at', 'DESC');

    const result = await query.getMany();
    return result;
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
      ])
      .where('schedule.user_id = :user_id', { user_id })
      // TODO: 만약 특정 컬럼들만 조회하려면 다음과 같이 leftJoin, addSelect 로 나누어서 해야한다.
      .leftJoin('schedule.user', 'user')
      .addSelect([
        'user.id',
        'user.nickname',
        'user.phone_number',
        'user.profile_image',
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

    // .leftJoinAndSelect('schedule.schedule_details', 'schedule_details')
    // .leftJoinAndSelect('schedule_details.destination', 'destination')
    // .orderBy({
    //   'schedule_details.day': 'ASC',
    //   'schedule_details.tour_order': 'ASC',
    // });

    const result = await query.getMany();

    return result;
  }
}
