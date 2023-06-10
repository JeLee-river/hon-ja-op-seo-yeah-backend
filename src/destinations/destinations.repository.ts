import { DataSource, Repository } from 'typeorm';
import { Destination } from './entities/destination.entity';
import { Injectable, Logger } from '@nestjs/common';
import { CreateDestinationDto } from './dto/create-destination.dto';

@Injectable()
export class DestinationsRepository extends Repository<Destination> {
  constructor(private dataSource: DataSource) {
    super(Destination, dataSource.createEntityManager());
  }

  async insertDestinations(
    destinationsToInsert: CreateDestinationDto[],
  ): Promise<void> {
    const promises = destinationsToInsert.map(async (destination) => {
      const data = await this.create(destination);
      await this.save(data);
    });

    const result = await Promise.allSettled(promises);
    Logger.log(result);
  }

  // TODO: 여행지 검색 (카테고리와 여행지 타이틀)
  async searchDestinationsWithLikesAndComments(
    categoryIds,
    title,
  ): Promise<any> {
    // 여행지 목록을 좋아요, 댓글과 함께 조회한다.
    const query = this.createQueryBuilder('destination')
      .select('destination')
      .leftJoin('destination.destination_comments', 'destinations_comment')
      .addSelect([
        'destinations_comment.comment_id',
        'destinations_comment.comment',
        'destinations_comment.created_at',
        'destinations_comment.updated_at',
      ])
      .where('destination.title LIKE :title', {
        title: `%${title}%`,
      })
      .leftJoin('destinations_comment.user', 'comments_user')
      .addSelect([
        'comments_user.id',
        'comments_user.nickname',
        'comments_user.profile_image',
      ])
      .leftJoin('destination.destination_likes', 'destination_likes')
      .addSelect([
        'destination_likes.destination_id',
        'destination_likes.user_id',
        'destination_likes.is_liked',
        'destination_likes.created_at',
        'destination_likes.updated_at',
      ])
      .leftJoin('destination_likes.user', 'likes_user')
      .addSelect([
        'likes_user.id',
        'likes_user.nickname',
        'likes_user.profile_image',
      ]);

    if (categoryIds.length > 0) {
      query.andWhere('destination.category_id IN (:...categoryIds)', {
        categoryIds,
      });
    }

    return await query.getMany();
  }

  // TODO :test 후 지울 것
  async getDestinationWithLikesAndComments(
    destination_id: number,
  ): Promise<any> {
    // 여행지 목록을 좋아요, 댓글과 함께 조회한다.
    return await this.createQueryBuilder('destination')
      .select('destination')
      .leftJoin('destination.destination_comments', 'destinations_comment')
      .addSelect([
        'destinations_comment.comment_id',
        'destinations_comment.comment',
        'destinations_comment.created_at',
        'destinations_comment.updated_at',
      ])
      .where('destination.id = :destination_id', { destination_id })
      .leftJoin('destinations_comment.user', 'comments_user')
      .addSelect([
        'comments_user.id',
        'comments_user.nickname',
        'comments_user.profile_image',
      ])
      .leftJoin('destination.destination_likes', 'destination_likes')
      .addSelect([
        'destination_likes.destination_id',
        'destination_likes.user_id',
        'destination_likes.is_liked',
        'destination_likes.created_at',
        'destination_likes.updated_at',
      ])
      .leftJoin('destination_likes.user', 'likes_user')
      .addSelect([
        'likes_user.id',
        'likes_user.nickname',
        'likes_user.profile_image',
      ])
      .getOne();
  }

  async getDestinationsRanking(count: number): Promise<Destination[]> {
    // TODO : 추후에 '좋아요' 순으로 정렬하여 조회해야 한다.
    const destinations = await this.find({
      take: count,
    });

    return destinations;
  }
}
