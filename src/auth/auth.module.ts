import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from './users.repository';

import { JwtStrategy } from './strategies/jwt.strategy';

import * as config from 'config';
import { SchedulesModule } from '../schedules/schedules.module';
import { SchedulesLikesModule } from '../schedules-likes/schedules-likes.module';
import { SchedulesCommentsModule } from '../schedules-comments/schedules-comments.module';
import { DestinationsLikesModule } from '../destinations-likes/destinations-likes.module';
import { DestinationsCommentsModule } from '../destinations-comments/destinations-comments.module';
import { SchedulesRepository } from '../schedules/schedules.repository';
import { SchedulesLikesRepository } from '../schedules-likes/schedules-likes.repository';
import { SchedulesDetailRepository } from '../schedules/schedules-detail.repository';
import { DestinationsLikesRepository } from '../destinations-likes/destinations-likes.repository';
import { DestinationsCommentsRepository } from '../destinations-comments/destinations-comments.repository';
import { SchedulesCommentsRepository } from '../schedules-comments/schedules-comments.repository';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    SchedulesModule,
    SchedulesLikesModule,
    SchedulesCommentsModule,
    DestinationsLikesModule,
    DestinationsCommentsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConfig.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: jwtConfig.ACCESS_TOKEN_EXPIRATION_TIME,
      },
    }),
    JwtModule.register({
      secret: jwtConfig.JWT_REFRESH_TOKEN_SECRET,
      signOptions: {
        expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRATION_TIME,
      },
    }),
    TypeOrmModule.forFeature([UsersRepository]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersRepository,
    JwtStrategy,
    SchedulesRepository,
    SchedulesDetailRepository,
    SchedulesLikesRepository,
    SchedulesCommentsRepository,
    DestinationsLikesRepository,
    DestinationsCommentsRepository,
  ],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
