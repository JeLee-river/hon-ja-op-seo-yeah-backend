import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
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

    await this.save(user);

    delete user.password;

    return {
      message: '회원가입이 완료되었습니다!',
      user,
    };
  }
}
