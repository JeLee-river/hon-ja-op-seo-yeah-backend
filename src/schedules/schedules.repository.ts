import { DataSource, Repository } from 'typeorm';
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

  async getAllSchedules(): Promise<Schedule[]> {
    const query = this.createQueryBuilder('a')
      .select([
        'a.user_id',
        'a.title',
        'a.summary',
        'a.start_date',
        'a.end_date',
        'a.duration',
        'b.day',
        'b.tour_order',
        'c.title',
      ])
      .leftJoinAndSelect('a.schedule_details', 'b')
      .leftJoinAndSelect('b.destination', 'c')
      .where('a.status = :status', { status: 'PUBLIC' })
      .orderBy({
        'b.day': 'ASC',
        'b.tour_order': 'ASC',
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
      .where('schedule.schedule_id = :scheduleId', { scheduleId })
      .orderBy({
        'schedule_details.day': 'ASC',
        'schedule_details.tour_order': 'ASC',
      });

    const result = await query.getOne();

    return result;
  }

  async getSchedulesRannking(): Promise<Schedule[]> {
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
      .where('a.status = :status', { status: 'PUBLIC' });

    const result = await query.getMany();
    return result;
  }
}
