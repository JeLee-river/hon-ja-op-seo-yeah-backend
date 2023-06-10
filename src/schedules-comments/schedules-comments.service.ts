import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSchedulesCommentDto } from './dto/create-schedules-comment.dto';
import { SchedulesComment } from './entities/schedules-comment.entity';
import { SchedulesCommentsRepository } from './schedules-comments.repository';
import { SchedulesRepository } from '../schedules/schedules.repository';
import { UpdateSchedulesCommentDto } from './dto/update-schedules-comment.dto';

@Injectable()
export class SchedulesCommentsService {
  constructor(
    private scheduleCommentsRepository: SchedulesCommentsRepository,
    private schedulesRepository: SchedulesRepository,
  ) {}

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

  async checkUserIsCommentWriter(comment_id, user_id): Promise<boolean> {
    const comment = await this.scheduleCommentsRepository.getCommentByCommentId(
      comment_id,
    );

    if (!comment) {
      throw new NotFoundException(
        `해당 댓글이 존재하지 않습니다. (comment_id : ${comment_id})`,
      );
    }

    const commentWriterId = comment.user_id;
    return user_id === commentWriterId;
  }

  async updateScheduleComment(
    user_id: string,
    comment_id: number,
    updateSchedulesCommentDto: UpdateSchedulesCommentDto,
  ): Promise<SchedulesComment> {
    // 본인이 작성자인지 확인한다.
    const isUserCommentWriter = await this.checkUserIsCommentWriter(
      comment_id,
      user_id,
    );

    if (!isUserCommentWriter) {
      throw new UnauthorizedException(
        '작성자 본인만 댓글을 수정할 수 있습니다.',
      );
    }

    return this.scheduleCommentsRepository.updateScheduleComment(
      comment_id,
      updateSchedulesCommentDto,
    );
  }

  async deleteScheduleComment(
    user_id: string,
    comment_id: number,
  ): Promise<{ message: string }> {
    // 본인이 작성자인지 확인한다.

    try {
      const isUserCommentWriter = await this.checkUserIsCommentWriter(
        comment_id,
        user_id,
      );

      if (!isUserCommentWriter) {
        throw new UnauthorizedException(
          '작성자 본인만 댓글을 삭제할 수 있습니다.',
        );
      }

      const deleteResult =
        await this.scheduleCommentsRepository.deleteScheduleComment(comment_id);
      const deletedCount = deleteResult.affected;

      if (deletedCount <= 0) {
        throw new InternalServerErrorException(
          `댓글 삭제에 실패했습니다. (comment_id : ${comment_id})`,
        );
      }

      return {
        message: '댓글이 성공적으로 삭제되었습니다.',
      };
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }
}
