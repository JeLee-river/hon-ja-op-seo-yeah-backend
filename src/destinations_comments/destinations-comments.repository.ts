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
}
