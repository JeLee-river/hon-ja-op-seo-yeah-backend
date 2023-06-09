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
    // ! 존재하지 않는 schedule_id 로 요청할 경우
    const schedule = await this.schedulesRepository.getScheduleById(
      schedule_id,
    );

    if (!schedule) {
      throw new NotFoundException('해당 여행 일정이 존재하지 않습니다.');
    }

    return this.scheduleCommentsRepository.createScheduleComment(
      user_id,
      schedule_id,
      createSchedulesCommentDto,
    );
  }
}
