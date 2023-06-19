import { Injectable, NotFoundException } from '@nestjs/common';

import { SchedulesLike } from './entities/schedules-like.entity';

import { SchedulesRepository } from '../schedules/schedules.repository';
import { SchedulesLikesRepository } from './schedules-likes.repository';

import { SelfLikeException } from './filters/self-like.exception';

import { ResponseScheduleLikesInterface } from '../types/ResponseScheduleLikes.interface';

@Injectable()
export class SchedulesLikesService {
  constructor(
    private schedulesLikesRepository: SchedulesLikesRepository,
    private schedulesRepository: SchedulesRepository,
  ) {}

  async toggleLikeForSchedule(
    user_id: string,
    schedule_id: number,
  ): Promise<ResponseScheduleLikesInterface> {
    // TODO: 좋아요 요청한 일정이 자신이 작성한 일정이라면 좋아요를 못하게 막아야 한다.
    const targetSchedule = await this.schedulesRepository.getScheduleById(
      schedule_id,
    );

    if (!targetSchedule) {
      throw new NotFoundException('요청한 여행 일정은 존재하지 않습니다.');
    }

    if (user_id === targetSchedule.user.id) {
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
      const { is_liked } = likedForSchedule;
      const newLiked = !is_liked;

      const newLike: SchedulesLike = {
        ...likedForSchedule,
        is_liked: newLiked,
      };

      const updatedScheduleLike =
        await this.schedulesLikesRepository.updateLikedSchedule(newLike);

      // 좋아요가 업데이트 됐으니까 해당 일정의 좋아요 카운트를 다시 확인한다.
      const likes_count_of_schedule =
        await this.schedulesLikesRepository.getLikesCountOfSchedule(
          schedule_id,
        );

      return {
        schedule_id,
        user_id,
        is_liked: newLiked,
        likes_count_of_schedule,
      };
    }

    // 이미 좋아요한 일정이 아니라면 -> 좋아요 데이터를 생성한다.
    const createdScheduleLike =
      await this.schedulesLikesRepository.createLikeForSchedule(
        user_id,
        schedule_id,
      );

    // 좋아요를 추가했으니까 해당 일정의 좋아요 카운트를 다시 확인한다.
    const likes_count_of_schedule =
      await this.schedulesLikesRepository.getLikesCountOfSchedule(schedule_id);

    const { is_liked } = createdScheduleLike;

    return {
      schedule_id,
      user_id,
      is_liked,
      likes_count_of_schedule,
    };
  }

  async hasUserLikedSchedule(
    user_id: string,
    schedule_id: number,
  ): Promise<ResponseScheduleLikesInterface> {
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
