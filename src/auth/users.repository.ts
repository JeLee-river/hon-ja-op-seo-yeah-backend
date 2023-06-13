import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { DataSource, Repository, UpdateResult } from 'typeorm';

import { User } from './entities/user.entity';

import { AuthCredentialDto } from './dto/auth-credential.dto';

import { PostgresErrorCodesEnum } from '../types/postgresErrorCodes.enum';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ message: string; user: User }> {
    const { id, password } = authCredentialDto;

    // 이미 존재하는 아이디인지 체크한다.
    const foundUser: User = await this.findUserById(id);
    if (foundUser) {
      throw new ConflictException({
        statusCode: 409,
        error: 'Conflict',
        field: 'email',
        message: '이미 존재하는 이메일입니다.',
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = this.create({
        ...authCredentialDto,
        password: hashedPassword,
      });

      await this.save(user);

      // 클라이언트에 전달할 유저 정보 중 password 를 제거한다.
      delete user.password;

      return {
        message: '회원가입이 완료되었습니다!',
        user,
      };
    } catch (error) {
      if (error.code === PostgresErrorCodesEnum.UniqueViolation) {
        throw new ConflictException({
          statusCode: 409,
          error: 'Conflict',
          field: 'nickname',
          message: '이미 존재하는 별명입니다.',
        });
      } else {
        throw new InternalServerErrorException(
          '알 수 없는 오류가 발생했습니다.',
        );
      }
    }
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.findOne({
      where: {
        id: userId,
      },
    });

    return user;
  }

  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.update(
      { id: userId },
      {
        refresh_token: refreshToken,
      },
    );
  }

  async updateUserInformation(
    userToUpdate: AuthCredentialDto,
  ): Promise<{ message: string; user: User }> {
    const user = await this.create(userToUpdate);
    await this.save(user);

    // TODO: 이런 정보를 제외한 유저 정보를 조회하는 메서드를 추가하자.
    delete user.idx;
    delete user.password;
    delete user.refresh_token;

    return {
      message: '사용자 정보가 성공적으로 수정되었습니다.',
      user,
    };
  }

  async deleteUserInformation(userId: string): Promise<{ message: string }> {
    const query = await this.createQueryBuilder('user')
      .delete()
      .from(User)
      .where('id = :id', { id: userId })
      .execute();

    return {
      message: '사용자 정보가 성공적으로 삭제되었습니다.',
    };
  }

  async findUserByNickname(nickname: string): Promise<User> {
    const user = await this.findOne({
      where: {
        nickname: nickname,
      },
    });

    return user;
  }

  async saveUserProfileImagePath(
    userId: string,
    imagePath: string,
  ): Promise<UpdateResult> {
    return await this.createQueryBuilder('user')
      .update(User)
      .set({ profile_image: imagePath })
      .where('id = :id', { id: userId })
      .execute();
  }
}
