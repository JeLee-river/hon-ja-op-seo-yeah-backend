import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DestinationsComment } from './entities/destinations-comment.entity';
import { CreateDestinationsCommentDto } from './dto/create-destinations-comment.dto';

@Injectable()
export class DestinationsCommentsRepository extends Repository<DestinationsComment> {
  constructor(private dataSource: DataSource) {
    super(DestinationsComment, dataSource.createEntityManager());
  }

  /**
   * 여행지 리뷰 생성
   * @param user_id
   * @param createDestinationsCommentDto
   */
  async createDestinationComment(
    user_id: string,
    createDestinationsCommentDto: CreateDestinationsCommentDto,
  ) {
    const comment = this.create({
      user_id,
      ...createDestinationsCommentDto,
    });

    await this.save(comment);

    return comment;
  }

  async getCommentsByDestinationId(
    destinationId: number,
  ): Promise<DestinationsComment[]> {
    const query = this.createQueryBuilder('destinationComment')
      .select([
        'destinationComment.comment_id',
        'destinationComment.destination_id',
        'destinationComment.comment',
        'destinationComment.created_at',
        'destinationComment.updated_at',
      ])
      .where('destination_id = :destination_id', {
        destination_id: destinationId,
      })
      // TODO: 만약 특정 컬럼들만 조회하려면 다음과 같이 leftJoin, addSelect 로 나누어서 해야한다.
      .leftJoin('destinationComment.user', 'user')
      .addSelect(['user.id', 'user.nickname', 'user.profile_image'])
      .orderBy({
        'destinationComment.created_at': 'ASC',
      });

    const result = await query.getMany();
    return result;
    return null;
  }
}
