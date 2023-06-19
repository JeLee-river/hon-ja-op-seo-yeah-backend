import { Injectable } from '@nestjs/common';

import { DestinationsLike } from './entities/destinations-like.entity';

import { DestinationsLikesRepository } from './destinations-likes.repository';

@Injectable()
export class DestinationsLikesService {
  constructor(
    private destinationsLikesRepository: DestinationsLikesRepository,
  ) {}

  async toggleLikesForDestination(
    user_id: string,
    destination_id: number,
  ): Promise<Omit<DestinationsLike, 'idx'>> {
    // 요청한 유저가 이미 해당 여행지에 좋아요를 최초 1번이라도 한 적이 있는지 확인해야 한다.
    const foundLikeForDestination =
      await this.destinationsLikesRepository.findLikedDestination(
        user_id,
        destination_id,
      );

    // 좋아요 한 내역이 있을 경우 -> 업데이트(=토글) 한다.
    if (foundLikeForDestination) {
      const { is_liked } = foundLikeForDestination;

      const newLike: DestinationsLike = {
        ...foundLikeForDestination,
        is_liked: !is_liked,
      };

      const updatedLike =
        await this.destinationsLikesRepository.updatedLikedDestination(newLike);

      const { idx, ...result } = updatedLike;

      return result;
    }

    // 좋아요 한 내역이 없을 경우 -> 새로 추가한다.
    const createdLike =
      await this.destinationsLikesRepository.createLikesForDestination(
        user_id,
        destination_id,
      );

    const { idx, ...result } = createdLike;
    return result;
  }
}
