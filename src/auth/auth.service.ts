import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

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

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { id, password } = signInDto;

    try {
      const user = await this.usersRepository.findUserById(id);
      await this.verifyPassword(password, user.password);

      const { password: userPassword, ...result } = user;

      const payload = result;
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } catch (error) {
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
}
