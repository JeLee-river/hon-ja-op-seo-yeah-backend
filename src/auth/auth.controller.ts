import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

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
    description: '액세스 토큰을 발급한다.',
    schema: {
      type: 'string',
      example: { accessToken: 'yourExampleTokenHere' },
    },
  })
  signIn(
    @Body(ValidationPipe) signInDto: SignInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInDto);
  }

  /**
   * 테스트 : 추후에 삭제할 것.
   *
   * 사용자가 로그인하여 얻은 액세스 토큰으로 /test 요청 시,
   * Request 안에 있는 user 정보를 가져온다.
   * @param user
   */
  @Post('/test')
  @UseGuards(AuthGuard())
  @ApiExcludeEndpoint() // Swagger 에서 제외하는 데코레이터
  @ApiOperation({ summary: '테스트 API : 추후 삭제 예정' })
  test(@GetUser() user: Omit<User, 'password'>) {
    console.log(user);
  }
}
