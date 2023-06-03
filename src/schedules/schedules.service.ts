import { Injectable } from '@nestjs/common';
import { SchedulesRepository } from './schedules.repository';

@Injectable()
export class SchedulesService {
  constructor(private schedulesRepository: SchedulesRepository) {}
}
