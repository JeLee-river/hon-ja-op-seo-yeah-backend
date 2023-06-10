import {
  HttpException,
  HttpStatus,
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
import { SchedulesLikesRepository } from '../schedules-likes/schedules-likes.repository';
import { SchedulesCommentsRepository } from '../schedules-comments/schedules-comments.repository';

@Injectable()
export class SchedulesService {
  constructor(
    private schedulesRepository: SchedulesRepository,
    private scheduleDetailRepository: SchedulesDetailRepository,
    private schedulesLikesRepository: SchedulesLikesRepository,
    private schedulesCommentsRepository: SchedulesCommentsRepository,
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
    const { schedule_id, destinations } = updateScheduleDto;

    try {
      // 여행 일정 기본 정보 update
      const schedule = await this.schedulesRepository.createSchedule(
        userId,
        updateScheduleDto,
      );

      // 기존의 상세 일정을 delete 한다.
      await this.scheduleDetailRepository.deleteScheduleDetailsById(
        schedule_id,
      );

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

  /**
   * 전체 일정 조회 (좋아요, 댓글 포함)
   */
  async getAllSchedulesWithLikesAndComments(): Promise<Schedule[]> {
    const schedules =
      await this.schedulesRepository.getAllSchedulesWithLikesAndComments();

    const newSchedules = schedules.map((schedule) => {
      return this.transformSchedule(schedule);
    });

    return newSchedules;
  }

  /**
   * 로그인 한 유저가 작성한 모든 일정 조회 (좋아요, 댓글 포함)
   * @param user_id
   */
  async getMySchedules(user_id: string): Promise<Schedule[]> {
    const schedules = await this.schedulesRepository.getSchedulesByUserId(
      user_id,
    );

    const newSchedules = schedules.map((schedule) => {
      return this.transformSchedule(schedule);
    });

    return newSchedules;
  }

  /**
   * 특정 여행 일정 조회 (좋아요, 댓글 포함)
   * @param scheduleId
   */
  async getScheduleById(
    scheduleId: number,
  ): Promise<ResponseScheduleInterface> {
    const schedule = await this.schedulesRepository.getScheduleById(scheduleId);

    if (!schedule) {
      throw new NotFoundException('요청한 여행 일정은 존재하지 않습니다.');
    }

    return this.transformSchedule(schedule);
  }

  /**
   * 특정 일정 삭제
   * - 해당 일정의 좋아요, 댓글, 상세 정보까지 모두 삭제한다. (외래 키 참조 때문)
   * @param user_id
   * @param schedule_id
   */
  async deleteScheduleById(
    user_id: string,
    schedule_id: number,
  ): Promise<{ message: string }> {
    // TODO: 삭제하려는 일정이 존재하는지 확인한다.
    const foundSchedule = await this.schedulesRepository.getScheduleById(
      schedule_id,
    );

    if (!foundSchedule) {
      throw new NotFoundException('삭제하려는 여행 일정이 존재하지 않습니다.');
    }

    const writer = foundSchedule.user.id;
    const isMatchingUser = user_id === writer;

    if (!isMatchingUser) {
      throw new UnauthorizedException(
        '작성자가 아니시군요? 당신은 해당 일정을 삭제할 권한이 없습니다.',
      );
    }

    // 여행 일정의 좋아요 데이터들을 제거 : 외래키 제약 조건 때문에 먼저 지워야 함.
    const deleteScheduleLikes =
      await this.schedulesLikesRepository.deleteLikesByScheduleId(schedule_id);

    // 여행 일정의 달린 댓글 데이터들을 제거 : 외래키 제약 조건 때문에 먼저 지워야 함.
    const deleteScheduleComments =
      await this.schedulesCommentsRepository.deleteCommentsByScheduleId(
        schedule_id,
      );

    // 여행 상세 일정 삭제 : 역시 외래키 제약 조건 때문에 먼저 지워야 함.
    const deleteScheduleDetails =
      await this.scheduleDetailRepository.deleteScheduleDetailsById(
        schedule_id,
      );

    // 여행 일정 기본 내용 삭제
    const deleteSchedule = await this.schedulesRepository.deleteScheduleById(
      schedule_id,
    );

    return {
      message: '일정이 성공적으로 삭제되었습니다.',
    };
  }

  /**
   * DB 에서 조회한 여행 일정 데이터를 클라이언트에 실제 응답할 형식으로 변환한다.
   * @param schedule
   */
  transformSchedule(schedule: Schedule) {
    const { duration, schedule_details, schedules_likes, schedules_comments } =
      schedule;

    // TODO : 이 일정의 좋아요 개수를 카운트하고, 좋아요 한 유저 목록을 확인한다.
    const likes = schedules_likes.filter(({ is_liked }) => is_liked === true);
    const newLikes = likes.map(({ is_liked, user }) => user);

    // 이 일정의 댓글 갯수를 카운트한다
    const comments_count = schedules_comments.length;

    // 일자(day)별 목적지 목록 및 지도 좌표를 담도록 데이터를 가공한다.
    const { destinationIds, destinationTitles, destinationMaps } =
      this.transformDestinationsByDay(duration, schedule_details);

    // 여행지 목록을 담은 배열을 만들고, 첫번째와 마지막 목적지를 찾는다.
    const flattedDestinations = destinationTitles.flat();
    const first_destination = flattedDestinations[0];
    const last_destination =
      flattedDestinations[flattedDestinations.length - 1];
    const destination_count = flattedDestinations.length;

    // 상세 일정에 대한 데이터 변환이 끝났으므로 응답하지 않을 원본 데이터는 제거한다.
    delete schedule.schedule_details;
    delete schedule.schedules_likes;

    return {
      ...schedule,
      comments_count,
      likes_count: likes.length,
      likes: newLikes,
      first_destination,
      last_destination,
      destination_count,
      destinationIds,
      destinations: destinationTitles,
      destinationMaps,
    };
  }

  /**
   * 여행기간에 따라 일자별 destination 정보를 변환한다.
   * @param duration
   * @param schedule_details
   */
  transformDestinationsByDay(duration, schedule_details) {
    const FIRST_DAY_OF_DURATION = 1;
    const destinationIds = [];
    const destinationTitles = [];
    const destinationMaps = [];

    for (let day = FIRST_DAY_OF_DURATION; day <= duration; day++) {
      const ids: number[] = [];
      const titles: string[] = [];
      const maps = [];

      schedule_details.forEach((detail) => {
        if (detail.day === day) {
          ids.push(detail.destination_id);
          titles.push(detail.destination.title);
          maps.push({
            id: detail.destination.id,
            title: detail.destination.title,
            mapx: detail.destination.mapx,
            mapy: detail.destination.mapy,
          });
        }
      });

      destinationIds.push(ids);
      destinationTitles.push(titles);
      destinationMaps.push(maps);
    }

    return { destinationIds, destinationTitles, destinationMaps };
  }

  /**
   * 여행 일정 작성 중 여행지를 추가할 경우, 상세 일정을 업데이트한다.
   * @param user_id
   * @param schedule_id
   * @param destinations
   */
  async saveDestinationsForScheduleDetails(
    user_id: string,
    schedule_id: number,
    destinations: number[][],
  ): Promise<{
    destinationIds: number[][];
    destinationTitles: string[][];
  }> {
    // 기존 여행 일정을 조회해서 존재하는 여행 일정인지 확인한다.
    const schedule = await this.schedulesRepository.getScheduleById(
      schedule_id,
    );

    if (!schedule) {
      throw new NotFoundException('해당 여행 일정이 존재하지 않습니다.');
    }

    if (user_id === schedule.user_id) {
      throw new UnauthorizedException(
        `여행 일정을 작성한 작성자가 아닌 사용자는 수정할 권한이 없습니다.`,
      );
    }

    // 기존 duration 과 전달받은 destinations.length 를 비교한다.
    const { duration } = schedule;
    const requestedDuration = destinations.length;
    if (duration !== requestedDuration) {
      throw new HttpException(
        `기존 여행 기간과 요청한 일정 기간이 일치하지 않습니다. (기존 여행 기간: ${duration}, 요청한 기간: ${requestedDuration})`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // schedule_id 의 기존 상세 일정을 제거한다.
    await this.scheduleDetailRepository.deleteScheduleDetailsById(schedule_id);

    // 요청 받은 내용대로 상세 일정을 저장한다.
    await this.createScheduleDetails(schedule_id, destinations);

    // 새로 업데이트 된 일자별 schedule_details 정보를 확인한다.
    const updatedSchedule = await this.schedulesRepository.getScheduleById(
      schedule_id,
    );

    const destinationTitles = this.transformDestinationsByDay(
      requestedDuration,
      updatedSchedule.schedule_details,
    ).destinationTitles;

    // 일자별 여행지 id 와 title 을 각 배열에 담아 전달한다.
    return {
      destinationIds: destinations,
      destinationTitles,
    };
  }

  /**
   * 메인 화면에서 사용할 여행 일정 좋아요 순 랭킹
   * @param count
   */
  getSchedulesRanking(count: number): Promise<Schedule[]> {
    return this.schedulesRepository.getSchedulesRanking(count);
  }
}
