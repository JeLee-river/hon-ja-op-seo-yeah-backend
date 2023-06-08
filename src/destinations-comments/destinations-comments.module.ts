import { Module } from '@nestjs/common';
import { DestinationsCommentsService } from './destinations-comments.service';
import { DestinationsCommentsController } from './destinations-comments.controller';
import { DestinationsCommentsRepository } from './destinations-comments.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../auth/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DestinationsCommentsRepository])],
  controllers: [DestinationsCommentsController],
  providers: [
    DestinationsCommentsService,
    DestinationsCommentsRepository,
    UsersRepository,
  ],
})
export class DestinationsCommentsModule {}
