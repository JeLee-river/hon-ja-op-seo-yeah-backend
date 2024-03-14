import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { JwtService } from '@nestjs/jwt';

import { User } from './entities/user.entity';

import { UsersRepository } from './users.repository';
import { SchedulesRepository } from '../schedules/schedules.repository';
import { SchedulesDetailRepository } from '../schedules/schedules-detail.repository';
import { SchedulesLikesRepository } from '../schedules-likes/schedules-likes.repository';
import { SchedulesCommentsRepository } from '../schedules-comments/schedules-comments.repository';
import { DestinationsLikesRepository } from '../destinations-likes/destinations-likes.repository';
import { DestinationsCommentsRepository } from '../destinations-comments/destinations-comments.repository';

import { SignInDto } from './dto/sign-in.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { VerifyPasswordDto } from './dto/verify-password.dto';

import * as bcrypt from 'bcryptjs';

import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private schedulesRepository: SchedulesRepository,
    private schedulesDetailRepository: SchedulesDetailRepository,
    private schedulesLikesRepository: SchedulesLikesRepository,
    private schedulesCommentsRepository: SchedulesCommentsRepository,
    private destinationLikesRepository: DestinationsLikesRepository,
    private destinationsCommentsRepository: DestinationsCommentsRepository,

    private dataSource: DataSource,
  ) {}

  signUp(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ message: string; user: User }> {
    return this.usersRepository.createUser(authCredentialDto);
  }

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    const { id, password } = signInDto;

    try {
      const user = await this.usersRepository.findUserById(id);
      await this.verifyPassword(password, user.password);

      const payload = { id: user.id };

      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
      });
      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
      });

      await this.usersRepository.saveRefreshToken(user.id, refreshToken);

      // 전달할 유저 정보 중 제외할 항목들을 delete 한다.
      delete user.password;
      delete user.refresh_token;
      delete user.idx;

      return { accessToken, refreshToken, user };
    } catch (error) {
      Logger.error(error);
      throw new HttpException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return isPasswordMatching;
  }

  async findUserById(userId: string): Promise<User> {
    const user: User = await this.usersRepository.findUserById(userId);

    return user;
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });

      // Find the user associated with the refresh token
      const user: User = await this.usersRepository.findUserById(payload.id);

      if (!user) {
        throw new UnauthorizedException();
      }

      const newPayload = { id: user.id };

      // Create a new access token
      const newAccessToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
      });

      // Optionally, create a new refresh token
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
      });

      await this.usersRepository.saveRefreshToken(user.id, newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      Logger.error(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getMyInformation(userId: string) {
    const myInformation: User = await this.findUserById(userId);

    delete myInformation.idx;
    delete myInformation.password;
    delete myInformation.refresh_token;

    return myInformation;
  }

  async updateUserInformation(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; user: User }> {
    const user = await this.findUserById(userId);

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    try {
      const { password: passwordToUpdate } = updateUserDto;
      // 사용자가 비밀번호를 수정하지 않을 경우 빈 문자열("")로 전달된다.
      // 이 경우에는 기존의 비밀번호를 그대로 저장해야 한다.
      let newPassword = '';
      if (passwordToUpdate === '') {
        newPassword = user.password;
      } else {
        newPassword = await this.bcryptPassword(passwordToUpdate);
      }

      const userToUpdate = {
        ...user,
        ...updateUserDto,
        password: newPassword,
      };

      const result = await this.usersRepository.updateUserInformation(
        userToUpdate,
      );
      return result;
    } catch (error) {
      Logger.error(error);
    }
    return;
  }

  async bcryptPassword(password) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  async verifyMyPassword(
    id: string,
    verifyPasswordDto: VerifyPasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findUserById(id);
    const { password } = verifyPasswordDto;

    const isPasswordMatching = await bcrypt.compare(password, user.password);

    if (!isPasswordMatching) {
      throw new HttpException(
        '비밀번호가 일치하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return {
      message: '비밀번호가 일치합니다.',
    };
  }

  async deleteUserInformation(userId: string): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const user = await this.findUserById(userId);

    if (!user) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      // 목적지 댓글 삭제
      await this.destinationsCommentsRepository.deleteDestinationCommentsByUserId(
        userId,
      );

      // 목적지 좋아요 삭제
      await this.destinationLikesRepository.deleteDestinationsLikesByUserId(
        userId,
      );

      // 현재 유저가 작성한 일정 ids 를 조회해야한다.
      const scheduleIdsToBeDelete =
        await this.schedulesRepository.getScheduleIdsByUserId(userId);

      if (scheduleIdsToBeDelete.length !== 0) {
        // 일정 좋아요 삭제
        await this.schedulesLikesRepository.deleteScheduleLikesByScheduleIds(
          scheduleIdsToBeDelete,
        );

        // 일정 댓글 삭제
        await this.schedulesCommentsRepository.deleteScheduleCommentsByScheduleIds(
          scheduleIdsToBeDelete,
        );

        // 일정 상세 삭제
        await this.schedulesDetailRepository.deleteScheduleDetailsByIds(
          scheduleIdsToBeDelete,
        );

        // 일정 삭제
        await this.schedulesRepository.deleteSchedulesByScheduleIds(
          scheduleIdsToBeDelete,
        );
      }

      // 유저 삭제
      await this.usersRepository.deleteUserInformation(userId);

      await queryRunner.commitTransaction();

      return {
        message: '사용자 정보가 성공적으로 삭제되었습니다.',
      };
    } catch (error) {
      Logger.error(error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async checkDuplicateNickname(nickname: string): Promise<{ message: string }> {
    const user = await this.usersRepository.findUserByNickname(nickname);

    if (user) {
      throw new HttpException(
        '이미 사용중인 닉네임입니다.',
        HttpStatus.CONFLICT,
      );
    }

    return { message: '사용 가능한 닉네임입니다.' };
  }

  async checkDuplicateId(id: string) {
    const user = await this.usersRepository.findUserById(id);

    if (user) {
      throw new HttpException(
        '이미 사용중인 이메일입니다.',
        HttpStatus.CONFLICT,
      );
    }

    return { message: '사용 가능한 이메일입니다.' };
  }
}
