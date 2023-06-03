import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SchedulesRepository } from './schedules.repository';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class SchedulesService {
  constructor(private schedulesRepository: SchedulesRepository) {}

  createSchedule(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    try {
      const schedule =
        this.schedulesRepository.createSchedule(createScheduleDto);

      return schedule;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('일정 등록에 실패하였습니다.');
    }
  }
}
