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
}
