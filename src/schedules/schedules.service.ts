import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { SchedulesRepository } from './schedules.repository';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { ScheduleDetail } from './entities/schedule-detail.entity';
import { SchedulesDetailRepository } from './schedules-detail.repository';
import { ResponseScheduleInterface } from '../types/ResponseSchedule.interface';

import { promises as fs } from 'fs';

@Injectable()
export class SchedulesService {
  constructor(
    private schedulesRepository: SchedulesRepository,
    private scheduleDetailRepository: SchedulesDetailRepository,
  ) {}

  async createSchedule(
    userId: string,
    createScheduleDto: CreateScheduleDto,
  ): Promise<{
    schedule: Schedule;
    scheduleDetails: Omit<ScheduleDetail, 'idx'>[];
  }> {
    try {
      // 여행 일정 기본 정보 insert
      const schedule = await this.schedulesRepository.createSchedule(
        userId,
        createScheduleDto,
      );

      // 여행 일정 기본 정보가 생성될 때 비로소 schedule_id 가 자동 생성된다.
      const { schedule_id } = schedule;
      const { detail } = createScheduleDto;

      // 여행 일자별 상세 일정 insert
      const scheduleDetails = await this.createScheduleDetails(
        schedule_id,
        detail,
      );

      return {
        schedule,
        scheduleDetails,
      };
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('일정 등록에 실패하였습니다.');
    }
  }

  async createScheduleDetails(
    schedule_id: number,
    detail: number[][],
  ): Promise<Omit<ScheduleDetail, 'idx'>[]> {
    const scheduleDetails = [];

    detail.map((days, index) => {
      const day = index + 1;
      days.forEach((destinationId, index) => {
        const tour_order = index + 1;
        scheduleDetails.push({
          schedule_id,
          destination_id: destinationId,
          day,
          tour_order,
        });
      });
    });

    const promises = scheduleDetails.map(async (scheduleDetail) => {
      return await this.scheduleDetailRepository.createScheduleDetail(
        scheduleDetail,
      );
    });

    try {
      const result = await Promise.all(promises);
      return result;
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('상세 일정 등록에 실패했습니다.');
    }
  }

  async getAllSchedules(): Promise<Schedule[]> {
    const schedules = await this.schedulesRepository.getAllSchedules();

    const newSchedules = schedules.map((schedule) => {
      return this.transformSchedule(schedule);
    });

    return newSchedules;
  }

  async getScheduleById(
    scheduleId: number,
  ): Promise<ResponseScheduleInterface> {
    const schedule = await this.schedulesRepository.getScheduleById(scheduleId);

    return this.transformSchedule(schedule);
  }

  transformSchedule(schedule) {
    const { duration, schedule_details } = schedule;

    const { destinationsByDay, destinationMaps } =
      this.transformDestinationsByDay(duration, schedule_details);

    const flattedDestinations = destinationsByDay.flat();
    const first_destination = flattedDestinations[0];
    const last_destination =
      flattedDestinations[flattedDestinations.length - 1];
    const destination_count = flattedDestinations.length;

    // 상세 일정에 대한 데이터 변환이 끝났으므로 응답하지 않을 원본 데이터는 제거한다.
    delete schedule.schedule_details;

    return {
      ...schedule,
      first_destination,
      last_destination,
      destination_count,
      destinations: destinationsByDay,
      destinationMaps,
    };
  }

  transformDestinationsByDay(duration, schedule_details) {
    const destinationsByDay = [];
    const FIRST_DAY_OF_DURATION = 1;
    const destinationMaps = [];

    for (let day = FIRST_DAY_OF_DURATION; day <= duration; day++) {
      const destinations = [];
      const destinationMap = [];

      schedule_details.forEach((detail) => {
        if (detail.day === day) {
          destinations.push(detail.destination.title);
          destinationMap.push({
            title: detail.destination.title,
            mapx: detail.destination.mapx,
            mapy: detail.destination.mapy,
          });
        }
      });

      destinationsByDay.push(destinations);
      destinationMaps.push(destinationMap);
    }

    return { destinationsByDay, destinationMaps };
  }

  getSchedulesRanking(count: number): Promise<Schedule[]> {
    return this.schedulesRepository.getSchedulesRanking(count);
  }
}
