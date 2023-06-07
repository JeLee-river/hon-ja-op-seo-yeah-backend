import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import * as config from 'config';

const jwtConfig = config.get('jwt');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  signUp(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ message: string; user: User }> {
    return this.usersRepository.createUser(authCredentialDto);
  }

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { id, password } = signInDto;

    try {
      const user = await this.usersRepository.findUserById(id);
      await this.verifyPassword(password, user.password);

      const { password: userPassword, ...result } = user;

      const payload = result;
      const accessToken = this.jwtService.sign(payload, {
        secret: jwtConfig.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: jwtConfig.ACCESS_TOKEN_EXPIRATION_TIME,
      });
      const refreshToken = this.jwtService.sign(payload, {
        secret: jwtConfig.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRATION_TIME,
      });

      // TODO: refresh Token 은 DB 에 저장해야 한다.
      await this.usersRepository.saveRefreshToken(user.id, refreshToken);

      return { accessToken, refreshToken };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findUserById(userId: string): Promise<User> {
    const user: User = await this.usersRepository.findUserById(userId);

    return user;
  }

  async refreshToken(
    oldAccessToken: string,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // TODO : Parameter 로 전달받는 게 아니라 DB 에서 RefreshToken 꺼내와야 한다.

      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtConfig.JWT_REFRESH_TOKEN_SECRET,
      });

      // Find the user associated with the refresh token
      const user: User = await this.usersRepository.findUserById(payload.id);

      if (!user) {
        throw new UnauthorizedException();
      }

      const { idx, password, ...newPayload } = user;

      // Create a new access token
      const newAccessToken = this.jwtService.sign(newPayload, {
        secret: jwtConfig.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: jwtConfig.ACCESS_TOKEN_EXPIRATION_TIME,
      });

      // Optionally, create a new refresh token
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: jwtConfig.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRATION_TIME,
      });

      // TODO: RefreshToken 은 DB에 update 해야 한다.
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
