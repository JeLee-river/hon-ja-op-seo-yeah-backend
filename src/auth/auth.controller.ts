import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from './guards/jwt-auth.guard';

import { User } from './entities/user.entity';

import { AuthService } from './auth.service';

import { SignInDto } from './dto/sign-in.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { VerifyPasswordDto } from './dto/verify-password.dto';
import { CheckDuplicateIdDto } from './dto/check-duplicate-id.dto';
import { CheckDuplicateNicknameDto } from './dto/check-duplicate-nickname.dto';

import { GetUserFromAccessToken } from './decorators/get-user-from-access-token.decorator';
import { GetRefreshToken } from './decorators/get-refresh-token.decorator';

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
    @Body(ValidationPipe) verifyPasswordDto: VerifyPasswordDto,
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

  @Post('/users/nickname')
  @ApiOperation({ summary: '닉네임 중복 확인' })
  @ApiBody({
    description: '사용할 닉네임 입력',
    schema: {
      example: {
        nickname: '사용할_닉네임',
      },
    },
  })
  @ApiOkResponse({
    description: '요청한 닉네임이 사용 가능한지 여부를 반환합니다.',
  })
  checkDuplicateNickname(
    @Body(ValidationPipe) checkNicknameDto: CheckDuplicateNicknameDto,
  ): Promise<{ message: string }> {
    return this.authService.checkDuplicateNickname(checkNicknameDto.nickname);
  }

  @Post('/users/email')
  @ApiOperation({ summary: '아이디(이메일) 중복 확인' })
  @ApiBody({
    description: '사용할 아이디(이메일) 입력',
    schema: {
      example: {
        id: '사용할_아이디(이메일)',
      },
    },
  })
  @ApiOkResponse({
    description: '요청한 아이디가 사용 가능한지 여부를 반환합니다.',
  })
  checkDuplicateId(
    @Body(ValidationPipe) checkDuplicateIdDto: CheckDuplicateIdDto,
  ): Promise<{ message: string }> {
    return this.authService.checkDuplicateId(checkDuplicateIdDto.id);
  }
}
