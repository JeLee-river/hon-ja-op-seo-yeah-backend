import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SchedulesRepository } from './schedules.repository';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { ScheduleDetail } from './entities/schedule-detail.entity';
import { SchedulesDetailRepository } from './schedules-detail.repository';

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
      console.log(error);
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
      console.log(error);
      throw new InternalServerErrorException('상세 일정 등록에 실패했습니다.');
    }
  }

  getAllSchedules(): Promise<Schedule[]> {
    return this.schedulesRepository.getAllSchedules();
  }

  async getScheduleById(scheduleId: number): Promise<Schedule> {
    // 기본 정보와 상세 정보를 모두 가져와야 한다.
    const schedule = await this.schedulesRepository.getScheduleById(scheduleId);

    // const { duration, schedule_details } = schedule;
    //
    // const FIRST_DAY_OF_DURATION = 1;
    //
    // // 상세 일정을 day 별로 묶기
    // const schedule_details_group_by_day = [];
    // for (let i = FIRST_DAY_OF_DURATION; i <= duration; i++) {
    //   let dayCount = 1;
    //   const details = [];
    //   schedule_details.forEach((detail) => {
    //     if (detail.day === dayCount) {
    //       details.push(detail);
    //     }
    //   });
    //
    //   schedule_details_group_by_day.push(details);
    //   dayCount += 1;
    // }
    //
    // const new_schedule = {
    //   ...schedule,
    //   schedule_details: schedule_details_group_by_day,
    // };
    //
    // return new_schedule;
    return schedule;
  }
}
