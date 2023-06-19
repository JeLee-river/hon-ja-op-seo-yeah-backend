import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DestinationsCommentsController } from './destinations-comments.controller';
import { DestinationsCommentsService } from './destinations-comments.service';
import { DestinationsCommentsRepository } from './destinations-comments.repository';

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
