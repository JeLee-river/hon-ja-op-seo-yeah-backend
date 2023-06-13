import { Injectable } from '@nestjs/common';

import { DataSource, Repository } from 'typeorm';

import { DestinationsLike } from './entities/destinations-like.entity';

@Injectable()
export class DestinationsLikesRepository extends Repository<DestinationsLike> {
  constructor(private dataSource: DataSource) {
    super(DestinationsLike, dataSource.createEntityManager());
  }

  async findLikedDestination(
    user_id: string,
    destination_id: number,
  ): Promise<DestinationsLike> {
    return await this.findOne({
      where: {
        user_id,
        destination_id,
      },
    });
  }

  async createLikesForDestination(user_id: string, destination_id: number) {
    const like = this.create({
      user_id,
      destination_id,
      is_liked: true, // 처음 좋아요를 하면 true 로 설정해야 한다.
    });

    return await this.save(like);
  }

  async updatedLikedDestination(newLike: DestinationsLike) {
    return await this.save(newLike);
  }
}
