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
    const query = this.createQueryBuilder('a')
      .select([
        'a.user_id',
        'a.title',
        'd.nickname',
        'a.summary',
        'a.start_date',
        'a.end_date',
        'a.duration',
        'b.day',
        'b.tour_order',
        'c.title',
      ])
      // TODO: 만약 특정 컬럼들만 조회하려면 다음과 같이 leftJoin, addSelect 로 나누어서 해야한다.
      // .leftJoin('a.schedule_details', 'b')
      // .addSelect(['b.day', 'b.tour_order'])
      // .leftJoin('b.destination', 'c')
      // .addSelect(['c.title'])
      .leftJoinAndSelect('a.schedule_details', 'b')
      .leftJoinAndSelect('b.destination', 'c')
      .leftJoinAndSelect('a.user', 'd')
      .where('a.schedule_id = :scheduleId', { scheduleId })
      .orderBy({
        'b.day': 'ASC',
        'b.tour_order': 'ASC',
      });

    const result = await query.getOne();

    return result;
  }
}
