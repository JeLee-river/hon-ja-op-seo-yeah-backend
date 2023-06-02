import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credential.dto';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ message: string; user: User }> {
    const user = this.create(authCredentialDto);

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('이미 존재하는 별명입니다.');
      } else {
        throw new InternalServerErrorException();
      }
    }

    delete user.password;

    return {
      message: '회원가입이 완료되었습니다!',
      user,
    };
  }
}
