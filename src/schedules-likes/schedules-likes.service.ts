import { Injectable, NotFoundException } from '@nestjs/common';
import { SchedulesLikesRepository } from './schedules-likes.repository';
import { SchedulesLike } from './entities/schedules-like.entity';
import { SelfLikeException } from '../utils/filters/self-like.exception';
import { SchedulesRepository } from '../schedules/schedules.repository';

@Injectable()
export class SchedulesLikesService {
  constructor(
    private schedulesLikesRepository: SchedulesLikesRepository,
    private schedulesRepository: SchedulesRepository,
  ) {}

  async toggleLikeForSchedule(
    user_id: string,
    schedule_id: number,
  ): Promise<Omit<SchedulesLike, 'idx'>> {
    // TODO: 좋아요 요청한 일정이 자신이 작성한 일정이라면 좋아요를 못하게 막아야 한다.
    const targetSchedule = await this.schedulesRepository.getScheduleById(
      schedule_id,
    );

    if (!targetSchedule) {
      throw new NotFoundException('요청한 여행 일정은 존재하지 않습니다.');
    }

    if (targetSchedule && user_id === targetSchedule.user_id) {
      throw new SelfLikeException();
    }

    // 요청한 유저가 이미 해당 일정에 좋아요를 한 번이라도 했는지 확인해야 한다.
    const likedForSchedule =
      await this.schedulesLikesRepository.findLikedSchedule(
        user_id,
        schedule_id,
      );

    // 이미 좋아요한 일정이었다면 -> 업데이트 한다.
    if (likedForSchedule) {
      if (user_id === likedForSchedule.user_id) {
        throw new SelfLikeException();
      }

      const { is_liked } = likedForSchedule;

      const newLike: SchedulesLike = {
        ...likedForSchedule,
        is_liked: !is_liked,
      };

      const updatedSchedueLike =
        await this.schedulesLikesRepository.updateLikedSchedule(newLike);

      const { idx, ...result } = updatedSchedueLike;

      return result;
    }

    // 이미 좋아요한 일정이 아니라면 -> 좋아요 데이터를 생성한다.
    const createdScheduleLike =
      await this.schedulesLikesRepository.createLikeForSchedule(
        user_id,
        schedule_id,
      );

    const { idx, ...result } = createdScheduleLike;
    return result;
  }

  async hasUserLikedSchedule(user_id: string, schedule_id: number) {
    const targetSchedule = await this.schedulesRepository.getScheduleById(
      schedule_id,
    );

    if (!targetSchedule) {
      throw new NotFoundException('요청한 여행 일정은 존재하지 않습니다.');
    }

    const likedForSchedule =
      await this.schedulesLikesRepository.findLikedSchedule(
        user_id,
        schedule_id,
      );

    const likes_count_of_schedule =
      await this.schedulesLikesRepository.getLikesCountOfSchedule(schedule_id);

    if (!likedForSchedule) {
      return {
        schedule_id,
        user_id,
        is_liked: false,
        likes_count_of_schedule,
      };
    }

    const { is_liked } = likedForSchedule;

    return {
      schedule_id,
      user_id,
      is_liked,
      likes_count_of_schedule,
    };
  }
}
