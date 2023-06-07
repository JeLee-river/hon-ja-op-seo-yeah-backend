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
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    // Bearer Token 에서 실제 Token 만 분리하기
    const bearerToken = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(
        bearerToken,
        config.get('jwt.JWT_ACCESS_TOKEN_SECRET'),
      );

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
