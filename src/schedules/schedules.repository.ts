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
    createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    const schedule = this.create(createScheduleDto);

    await this.save(schedule);

    return schedule;
  }

  async getAllSchedules(): Promise<Schedule[]> {
    return await this.find({
      where: {
        status: 'PUBLIC',
      },
    });
  }

  async getScheduleById(scheduleId: number): Promise<Schedule> {
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
      .where('a.schedule_id = :scheduleId', { scheduleId })
      .orderBy({
        'b.day': 'ASC',
        'b.tour_order': 'ASC',
      });

    const result = await query.getOne();

    return result;
  }
}
