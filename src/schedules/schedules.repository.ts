import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SchedulesRepository extends Repository<Schedule> {
  constructor(private dataSource: DataSource) {
    super(Schedule, dataSource.createEntityManager());
  }
}
