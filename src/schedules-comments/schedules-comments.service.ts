import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSchedulesCommentDto } from './dto/create-schedules-comment.dto';
import { SchedulesComment } from './entities/schedules-comment.entity';
import { SchedulesCommentsRepository } from './schedules-comments.repository';
import { SchedulesRepository } from '../schedules/schedules.repository';

@Injectable()
export class SchedulesCommentsService {
  constructor(
    private scheduleCommentsRepository: SchedulesCommentsRepository,
    private schedulesRepository: SchedulesRepository,
  ) {}

  async createScheduleComment(
    user_id: string,
    schedule_id: number,
    createSchedulesCommentDto: CreateSchedulesCommentDto,
  ): Promise<SchedulesComment> {
    // ! 존재하지 않는 schedule_id 로 요청할 경우 체크
    await this.isValidScheduleId(schedule_id);

    return this.scheduleCommentsRepository.createScheduleComment(
      user_id,
      schedule_id,
      createSchedulesCommentDto,
    );
  }

  async getCommentsByScheduleId(
    schedule_id: number,
  ): Promise<SchedulesComment[]> {
    // ! 존재하지 않는 schedule_id 로 요청할 경우 체크
    await this.isValidScheduleId(schedule_id);

    return this.scheduleCommentsRepository.getCommentsByScheduleId(schedule_id);
  }

  getCommentsByUserId(user_id: string): Promise<SchedulesComment[]> {
    return this.scheduleCommentsRepository.getCommentsByUserId(user_id);
  }

  // 존재하지 않는 schedule_id 인지 체크하는 함수
  async isValidScheduleId(schedule_id: number): Promise<void> {
    const schedule = await this.schedulesRepository.getScheduleById(
      schedule_id,
    );
    /*
        todo : 존재하지 않는 schedule_id 일 경우, 예외를 던지지만,
         존재할 경우에는 어떻게 처리할 것인가? 별도로 처리할 게 있을까?
       */
    if (!schedule) {
      throw new NotFoundException('해당 여행 일정이 존재하지 않습니다.');
    }
  }
}
