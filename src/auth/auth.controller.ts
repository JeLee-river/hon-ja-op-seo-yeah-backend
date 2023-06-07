import {
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';

import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetUserFromAccessToken } from './get-user-from-access-token.decorator';
import { GetRefreshToken } from './get-refresh-token.decorator';

@Controller('auth')
@ApiTags('사용자 (Users)')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({ description: '유저를 생성한다.', type: User })
  @ApiBody({
    type: AuthCredentialDto,
    description: '회원가입 시 입력할 정보',
  })
  signUp(
    @Body(ValidationPipe)
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ message: string; user: User }> {
    return this.authService.signUp(authCredentialDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: '로그인' })
  @ApiOkResponse({
    description: 'AccessToken과 RefreshToken을 발급한다.',
    schema: {
      type: 'string',
      example: {
        accessToken: 'yourExampleTokenHere',
        refreshToken: 'yourExampleTokenHere',
      },
    },
  })
  async signIn(
    @Body(ValidationPipe) signInDto: SignInDto,
  ): Promise<{ accessToken: string; refreshToken: string; user: User }> {
    return await this.authService.signIn(signInDto);
  }

  @Post('/refresh')
  @ApiBearerAuth('refresh-token')
  @ApiOperation({ summary: 'JWT 토큰 재발급' })
  @ApiOkResponse({
    description:
      '유효한 Refresh Token 을 이용해 새로운 AccessToken 과 RefreshToken 을 발급한다.',
    schema: {
      type: 'string',
      example: {
        accessToken: 'yourNewExampleTokenHere',
        refreshToken: 'yourNewExampleTokenHere',
      },
    },
  })
  async refreshToken(
    @GetRefreshToken() refreshToken,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.refreshToken(refreshToken);
  }

  // TODO: 사용자 인증이 필요한 api 호출시 인증이 제대로 이루어지는지 테스트하는 api
  @Post('/tokenTest')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async tokenTest(@GetUserFromAccessToken() user) {
    Logger.verbose(user);
  }
}
