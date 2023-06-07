import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
      comment_id,
      updateDestinationsCommentDto,
    );
  }

  async checkUserIsCommentWriter(comment_id, user_id): Promise<boolean> {
    const comment =
      await this.destinationsCommentsRepository.getCommentByCommentId(
        comment_id,
      );

    if (!comment) {
      throw new NotFoundException(
        `해당 댓글이 존재하지 않습니다. (comment_id : ${comment_id})`,
      );
    }

    const commentWriterId = comment.user_id;
    const isUserCommentWriter: boolean = user_id === commentWriterId;

    return isUserCommentWriter;
  }

  async deleteDestinationComment(
    user_id: string,
    comment_id: number,
  ): Promise<{ message: string }> {
    const isUserCommentWriter = await this.checkUserIsCommentWriter(
      comment_id,
      user_id,
    );

    if (!isUserCommentWriter) {
      throw new UnauthorizedException(
        '작성자가 아니시군요? 당신은 댓글을 수정할 권한이 없습니다.',
      );
    }

    const result =
      await this.destinationsCommentsRepository.deleteDestinationComment(
        comment_id,
      );

    const deletedCount = result.affected;
    if (deletedCount <= 0) {
      throw new InternalServerErrorException(
        `댓글 삭제에 실패했습니다. (comment_id : ${comment_id})`,
      );
    }

    return {
      message: '댓글이 성공적으로 삭제되었습니다.',
    };
  }

  getCommentsByUserId(user_id: string): Promise<DestinationsComment[]> {
    return this.destinationsCommentsRepository.getCommentsByUserId(user_id);
  }
}
