import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';

export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies['jwt'];

    try {
      const decoded = jwt.verify(
        accessToken,
        config.get('jwt.JWT_ACCESS_TOKEN_SECRET'),
      );
      // TODO: jwt.verify 실행 결과로 디코딩된 유저 정보 확인용 : 추후 삭제할 것
      // console.log(decoded);
      return true;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        // Token is expired.
        throw new UnauthorizedException('Token is expired');

        // TODO: Refresh Token 확인 및 Access Token 재발급하는 로직 추가하기
      } else if (error instanceof jwt.JsonWebTokenError) {
        // Token is invalid.
        throw new UnauthorizedException('Invalid Token');
      }
    }
    return false;
  }
}
