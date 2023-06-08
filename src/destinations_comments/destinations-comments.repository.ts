import { DataSource, DeleteResult, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DestinationsComment } from './entities/destinations-comment.entity';
import { CreateDestinationsCommentDto } from './dto/create-destinations-comment.dto';
import { UpdateDestinationsCommentDto } from './dto/update-destinations-comment.dto';

@Injectable()
export class DestinationsCommentsRepository extends Repository<DestinationsComment> {
  constructor(private dataSource: DataSource) {
    super(DestinationsComment, dataSource.createEntityManager());
  }

  /**
   * 여행지 댓글 작성
   *
   * @param user_id
   * @param destination_id
   * @param createDestinationsCommentDto
   */
  async createDestinationComment(
    user_id: string,
    destination_id: number,
    createDestinationsCommentDto: CreateDestinationsCommentDto,
  ) {
    const comment = this.create({
      user_id,
      destination_id,
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
  }

  async getCommentByCommentId(
    comment_id: number,
  ): Promise<DestinationsComment> {
    return await this.findOneBy({ comment_id });
  }

  async updateDestinationComment(
    comment_id: number,
    updateDestinationsCommentDto: UpdateDestinationsCommentDto,
  ) {
    const commentToBeUpdated = this.create({
      comment_id,
      ...updateDestinationsCommentDto,
    });

    await this.save(commentToBeUpdated);

    return commentToBeUpdated;
  }

  async deleteDestinationComment(comment_id: number): Promise<DeleteResult> {
    const result = await this.delete({ comment_id });
    return result;
  }

  async getCommentsByUserId(user_id: string) {
    const query = this.createQueryBuilder('destinationComment')
      .select([
        'destinationComment.comment_id',
        'destinationComment.destination_id',
        'destinationComment.comment',
        'destinationComment.created_at',
        'destinationComment.updated_at',
      ])
      .where('user_id = :user_id', {
        user_id,
      })
      .leftJoin('destinationComment.user', 'user')
      .addSelect(['user.id', 'user.nickname', 'user.profile_image'])
      .leftJoinAndSelect('destinationComment.destination', 'destination')
      .orderBy({
        'destinationComment.created_at': 'ASC',
      });

    const result = await query.getMany();
    return result;
  }
}
