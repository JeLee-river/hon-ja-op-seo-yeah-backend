import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateDestinationsCommentDto } from './dto/create-destinations-comment.dto';
import { DestinationsCommentsRepository } from './destinations-comments.repository';
import { DestinationsComment } from './entities/destinations-comment.entity';
import { UpdateDestinationsCommentDto } from './dto/update-destinations-comment.dto';
import { UsersRepository } from '../auth/users.repository';

@Injectable()
export class DestinationsCommentsService {
  constructor(
    private destinationsCommentsRepository: DestinationsCommentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  createDestinationComment(
    user_id: string,
    destinationId: number,
    createDestinationsCommentDto: CreateDestinationsCommentDto,
  ): Promise<DestinationsComment> {
    try {
      return this.destinationsCommentsRepository.createDestinationComment(
        user_id,
        destinationId,
        createDestinationsCommentDto,
      );
    } catch (error) {
      Logger.error(error);
    }
  }

  getCommentsByDestinationId(
    destinationId: number,
  ): Promise<DestinationsComment[]> {
    return this.destinationsCommentsRepository.getCommentsByDestinationId(
      destinationId,
    );
  }

  async updateDestinationComment(
    id: string,
    destination_id: number,
    comment_id: number,
    updateDestinationsCommentDto: UpdateDestinationsCommentDto,
  ) {
    const isUserCommentWriter = await this.checkUserIsCommentWriter(
      comment_id,
      id,
    );

    if (!isUserCommentWriter) {
      throw new UnauthorizedException(
        '작성자가 아니시군요? 당신은 댓글을 수정할 권한이 없습니다.',
      );
    }

    return this.destinationsCommentsRepository.updateDestinationComment(
      id,
      destination_id,
      comment_id,
      updateDestinationsCommentDto,
    );
  }

  async checkUserIsCommentWriter(comment_id, user_id): Promise<boolean> {
    const comment =
      await this.destinationsCommentsRepository.getCommentByCommentId(
        comment_id,
      );

    const commentWriterId = comment.user_id;
    const isUserCommentWriter: boolean = user_id === commentWriterId;

    return isUserCommentWriter;
  }
}
