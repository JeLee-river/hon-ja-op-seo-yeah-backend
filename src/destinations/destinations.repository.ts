import { Injectable, Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Destination } from './entities/destination.entity';

import { CreateDestinationDto } from './dto/create-destination.dto';

import { ResponseCountByCategoryInterface } from '../types/ResponseCountsByCategory.interface';

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

  /**
   * 여행지 목록을 카테고리, 타이틀로 검색한 결과를 전달한다.
   * TODO : pagination 추가하기
   *
   * @param categoryIds
   * @param title
   */
  async searchDestinationsWithLikesAndComments(
    categoryIds: string | string[],
    title: string,
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

  /**
   * 특정 여행지 정보를 좋아요, 댓글과 함께 전달한다.
   * TODO: 좋아요, 댓글을 조회하는 API 는 분리할 것.
   *
   * @param destination_id
   */
  async getDestinationWithLikesAndComments(
    destination_id: number,
  ): Promise<any> {
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

  /**
   * 메인 화면에서 사용할 좋아요 순 여행지 목록 조회
   * @param count
   */
  async getDestinationsRanking(count: number): Promise<Destination[]> {
    const query = this.createQueryBuilder('destination')
      .leftJoinAndSelect('destination.destination_likes', 'destination_likes')
      .select([
        'destination.id',
        'destination.title',
        'destination.homepage',
        'destination.tel',
        'destination.image1',
        'destination.image2',
        'destination.addr1',
        'destination.addr2',
        'destination.zipcode',
        'destination.mapx',
        'destination.mapy',
        'destination.overview',
        'destination.category_id',
        'COUNT(CASE WHEN destination_likes.is_liked = TRUE THEN 1 END) as likes_count',
      ])
      .groupBy('destination.id')
      .orderBy('likes_count', 'DESC')
      .limit(count);

    return await query.getRawMany();
  }

  /**
   * TEST : 여행지 목록을 카테고리, 타이틀로 검색한 결과를 전달한다. + 페이지네이션
   * TODO : pagination 추가하기
   *
   * @param categoryIds
   * @param title
   * @param paginationOptions
   */
  async searchDestinationsAndPagination(
    categoryIds: string,
    title: string,
    paginationOptions: {
      take: number;
      skip: number;
    },
  ): Promise<any> {
    const { take, skip } = paginationOptions;

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

    query.skip(skip).take(take);

    if (categoryIds.length > 0) {
      query.andWhere('destination.category_id IN (:...categoryIds)', {
        categoryIds,
      });
    }

    return await query.getMany();
  }

  async getCountsFromSearchByCategory(
    categoryIds: string,
    title: string,
  ): Promise<ResponseCountByCategoryInterface[]> {
    const query = this.createQueryBuilder('destination')
      .select(['category.id', 'category.name'])
      .leftJoin('destination.category', 'category')
      .addSelect(['COUNT(destination.category_id) as count'])
      .where('destination.title LIKE :title', {
        title: `%${title}%`,
      });

    if (categoryIds.length > 0) {
      query.andWhere('destination.category_id IN (:...categoryIds)', {
        categoryIds,
      });
    }
    query.groupBy('category.id, category.name');

    return await query.getRawMany();
  }
}
