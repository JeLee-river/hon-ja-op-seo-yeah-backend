import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from 'src/auth/entities/user.entity';

import { UsersRepository } from 'src/auth/users.repository';

import dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {
    super({
      // 토큰이 유효한지 체크할 때 사용하는 용도 : 토큰을 생성할 때 사용한 값과 같아야 한다.
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
      // 토큰을 어디에서 가져오는지 체크하는 용도 : Bearer Token 에서 가져오는 것을 체크.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /**
   * validate : 토큰이 유효한 지 확인이 되면 그때 실행되는 메서드.
   *
   * 위에서 토큰이 유효한지 체크가 되면 validate 메서드에서 payload 에 있는 유저 id가
   * 데이터베이스에 있는 id 인지 확인 후, 있다면 유저 객체를 return 한다.
   * return 값은 @UseGuards(AuthGuard()) 를 이용한 모든 요청의 Request Object 에 들어간다.
   * @param payload
   */
  async validate(payload): Promise<Omit<User, 'password'>> {
    const { id } = payload;
    const user: User = await this.usersRepository.findUserById(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { password, ...result } = user;

    return result;
  }
}
