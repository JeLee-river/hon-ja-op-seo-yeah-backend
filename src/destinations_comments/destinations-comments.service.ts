import { Injectable, Logger } from '@nestjs/common';
import { CreateDestinationsCommentDto } from './dto/create-destinations-comment.dto';
import { DestinationsCommentsRepository } from './destinations-comments.repository';
import { DestinationsComment } from './entities/destinations-comment.entity';

@Injectable()
export class DestinationsCommentsService {
  constructor(
    private destinationsCommentsRepository: DestinationsCommentsRepository,
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
}
