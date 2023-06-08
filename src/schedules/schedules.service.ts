import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SchedulesRepository } from './schedules.repository';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { Schedule } from './entities/schedule.entity';
import { ScheduleDetail } from './entities/schedule-detail.entity';
import { SchedulesDetailRepository } from './schedules-detail.repository';
import { ResponseScheduleInterface } from '../types/ResponseSchedule.interface';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class SchedulesService {
  constructor(
    private schedulesRepository: SchedulesRepository,
    private scheduleDetailRepository: SchedulesDetailRepository,
  ) {}

  async createScheduleBasic(
    userId: string,
    createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    try {
      // 여행 일정 기본 정보 insert
      const schedule = await this.schedulesRepository.createSchedule(
        userId,
        createScheduleDto,
      );

      return schedule;
    } catch (error) {
      Logger.error(error);
    }
  }

  async getScheduleBasic(schedule_id: number): Promise<Schedule> {
    try {
      // 여행 기본 정보 get
      const schedule = await this.schedulesRepository.getScheduleBasic(
        schedule_id,
      );

      return schedule;
    } catch (error) {
      Logger.error(error);
    }
  }

  async updateSchedule(
    userId: string,
    updateScheduleDto: UpdateScheduleDto,
  ): Promise<{
    schedule: Schedule;
    scheduleDetails: Omit<ScheduleDetail, 'idx'>[];
  }> {
    const { schedule_id: id } = updateScheduleDto;
    // 현재 로그인된 사용자와, 기존에 작성된 여행 일정의 작성자의 ID 를 비교한다.
    const foundSchedule = await this.schedulesRepository.getScheduleById(id);
    const writer = foundSchedule.user.id;
    const isMatchingUser = userId === writer;

    if (!isMatchingUser) {
      throw new UnauthorizedException(
        '작성자가 아니시군요? 당신은 해당 일정을 수정할 권한이 없습니다.',
      );
    }

    try {
      // 여행 일정 기본 정보 update
      const schedule = await this.schedulesRepository.createSchedule(
        userId,
        updateScheduleDto,
      );

      // schedule_id 에 해당하는 여행 상세 일정을 생성된다.
      const { schedule_id } = schedule;
      const { destinations } = updateScheduleDto;

      // 여행 일자별 상세 일정 insert
      const scheduleDetails = await this.createScheduleDetails(
        schedule_id,
        destinations,
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

  async getAllPublicSchedules(): Promise<Schedule[]> {
    const schedules = await this.schedulesRepository.getAllPublicSchedules();

    const newSchedules = schedules.map((schedule) => {
      return this.transformSchedule(schedule);
    });

    return newSchedules;
  }

  async getScheduleById(
    scheduleId: number,
  ): Promise<ResponseScheduleInterface> {
    const schedule = await this.schedulesRepository.getScheduleById(scheduleId);

    if (!schedule) {
      throw new NotFoundException('요청한 여행 일정은 존재하지 않습니다.');
    }

    return this.transformSchedule(schedule);
  }

  async deleteScheduleById(
    user_id: string,
    schedule_id: number,
  ): Promise<{ message: string }> {
    // TODO: 삭제하려는 일정이 존재하는지 확인한다.
    const foundSchedule = await this.schedulesRepository.getScheduleById(
      schedule_id,
    );

    if (!foundSchedule) {
      throw new NotFoundException('여행 일정이 존재하지 않습니다.');
    }

    const writer = foundSchedule.user.id;
    const isMatchingUser = user_id === writer;

    if (!isMatchingUser) {
      throw new UnauthorizedException(
        '작성자가 아니시군요? 당신은 해당 일정을 삭제할 권한이 없습니다.',
      );
    }

    // 여행 상세 일정 삭제 : 왜래 키 제약 조건 때문에 상세 일정을 먼저 지워야 한다.
    const resultFromDeleteScheduleDetails =
      await this.scheduleDetailRepository.deleteScheduleDetailsById(
        schedule_id,
      );

    const deletedDetailCount = resultFromDeleteScheduleDetails.affected;
    if (deletedDetailCount <= 0) {
      throw new InternalServerErrorException(
        `알 수 없는 오류로 인해 상세 일정 삭제에 실패했습니다. 
        관리자에게 문의하세요. (schedule_id : ${schedule_id})`,
      );
    }

    // 여행 일정 기본 내용 삭제
    const resultFromDeleteSchedule =
      await this.schedulesRepository.deleteScheduleById(schedule_id);

    const deleteScheduleCount = resultFromDeleteSchedule.affected;
    if (deleteScheduleCount <= 0) {
      throw new InternalServerErrorException(
        `알 수 없는 오류로 인해 일정 삭제에 실패했습니다. 
        관리자에게 문의하세요. (schedule_id : ${schedule_id})`,
      );
    }

    // TODO: 여행 일정에 달린 댓글들도 삭제해야 한다.
    return {
      message: '일정이 성공적으로 삭제되었습니다.',
    };
  }

  transformSchedule(schedule) {
    const { duration, schedule_details, schedules_likes } = schedule;

    // 이 일정의 좋아요 개수를 카운트하고, 좋아요 한 유저 목록을 확인한다.
    const likes = schedules_likes.map(({ is_liked, user }) => {
      if (is_liked) {
        return user;
      }
    });

    // 일자(day)별 목적지 목록 및 지도 좌표를 담도록 데이터를 가공한다.
    const { destinationsByDay, destinationMaps } =
      this.transformDestinationsByDay(duration, schedule_details);

    // 여행지 목록을 담은 배열을 만들고, 첫번째와 마지막 목적지를 찾는다.
    const flattedDestinations = destinationsByDay.flat();
    const first_destination = flattedDestinations[0];
    const last_destination =
      flattedDestinations[flattedDestinations.length - 1];
    const destination_count = flattedDestinations.length;

    // 상세 일정에 대한 데이터 변환이 끝났으므로 응답하지 않을 원본 데이터는 제거한다.;
    delete schedule.schedule_details;
    delete schedule.schedules_likes;

    return {
      ...schedule,
      likes_count: likes.length,
      likes,
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
            id: detail.destination.id,
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

  getMySchedules(user_id: string): Promise<Schedule[]> {
    return this.schedulesRepository.getSchedulesByUserId(user_id);
  }

  async saveDestinationsForScheduleDetails(
    schedule_id: number,
    destinations: number[][],
  ): Promise<Omit<ScheduleDetail, 'idx'>[]> {
    // schedule_id 의 기존 상세 일정을 제거한다.
    const result =
      await this.scheduleDetailRepository.deleteScheduleDetailsById(
        schedule_id,
      );

    const deletedDetailCount = result.affected;
    if (deletedDetailCount <= 0) {
      throw new InternalServerErrorException(
        `알 수 없는 오류로 인해 상세 일정 삭제에 실패했습니다. 
        관리자에게 문의하세요. (schedule_id : ${schedule_id})`,
      );
    }

    return await this.createScheduleDetails(schedule_id, destinations);
  }
}
