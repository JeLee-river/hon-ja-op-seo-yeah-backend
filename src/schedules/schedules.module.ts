import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesRepository } from './schedules.repository';
import { SchedulesDetailRepository } from './schedules-detail.repository';
import { AuthModule } from '../auth/auth.module';
import { UsersRepository } from '../auth/users.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SchedulesRepository, SchedulesDetailRepository]),
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService, SchedulesRepository, SchedulesDetailRepository],
})
export class SchedulesModule {}
