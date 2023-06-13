import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from './users.repository';

import { JwtStrategy } from '../utils/strategy/jwt.strategy';

import * as config from 'config';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
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
  providers: [AuthService, UsersRepository, JwtStrategy],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
