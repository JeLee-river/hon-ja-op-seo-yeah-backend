import {
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import * as dotenv from 'dotenv';
dotenv.config();

import { Observable } from 'rxjs';

import * as jwt from 'jsonwebtoken';

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
        process.env.JWT_ACCESS_TOKEN_SECRET,
      );

      return true;
    } catch (error) {
      // jwt.verify 에서 발생하는 에러를 처리한다.
      if (error instanceof jwt.TokenExpiredError) {
        // Access Token is expired.
        throw new UnauthorizedException({
          statusCode: 401,
          reason: 'EXPIRED',
          message: 'Unauthorized : Access Token is expired',
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        // Access is invalid.
        throw new UnauthorizedException({
          statusCode: 401,
          reason: 'INVALID',
          message: 'Unauthorized : Invalid Access Token',
        });
      }
      Logger.error(error);
    }
    return false;
  }
}
