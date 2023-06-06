import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import * as bcrypt from 'bcryptjs';
import { PostgresErrorCodesEnum } from '../types/postgresErrorCodes.enum';

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
        message: '이미 존재하는 아이디입니다.',
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
}
