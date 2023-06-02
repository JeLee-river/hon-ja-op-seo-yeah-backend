import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<{ message: string; user: User }> {
    return this.authService.signUp(authCredentialDto);
  }
}
