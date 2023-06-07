import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Put,
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
import { UpdateUserDto } from './dto/update-user.dto';
import { VerifyPasswordDto } from '../destinations/dto/verify-password.dto';

@Controller('auth')
@ApiTags('사용자 (Users)')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({
    description: '가입에 성공 시 유저 정보를 반환합니다.',
    type: User,
  })
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
    description: 'AccessToken과 RefreshToken을 발급합니다.',
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
    description: '새로운 AccessToken 과 RefreshToken 을 반환합니다.',
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

  @Get('/users/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiOkResponse({
    description: '로그인한 유저의 정보를 반환합니다.',
  })
  getMyInformation(@GetUserFromAccessToken() user) {
    return this.authService.getMyInformation(user.id);
  }

  @Put('/users/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '사용자 정보 수정' })
  @ApiOkResponse({
    description: '수정된 사용자 정보를 반환합니다.',
  })
  updateUserInformation(
    @GetUserFromAccessToken() user,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; user: User }> {
    return this.authService.updateUserInformation(user.id, updateUserDto);
  }

  @Post('/users/password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '비밀번호 확인' })
  @ApiBody({
    description: '비밀번호 입력',
    schema: {
      example: {
        password: '확인할_비밀번호',
      },
    },
  })
  @ApiOkResponse({
    description:
      '입력한 비밀번호와 사용자 비밀번호 간의 일치 여부를 반환합니다.',
  })
  verifyMyPassword(
    @GetUserFromAccessToken() user,
    @Body() verifyPasswordDto: VerifyPasswordDto,
  ): Promise<{ message: string }> {
    return this.authService.verifyMyPassword(user.id, verifyPasswordDto);
  }

  @Delete('/users/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: '사용자 정보 삭제' })
  @ApiOkResponse({
    description: '탈퇴 요청이 성공적으로 처리됐는지 반환합니다.',
  })
  deleteUserInformation(
    @GetUserFromAccessToken() user,
  ): Promise<{ message: string }> {
    return this.authService.deleteUserInformation(user.id);
  }
}
