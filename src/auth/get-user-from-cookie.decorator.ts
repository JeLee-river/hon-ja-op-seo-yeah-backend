import {
  createParamDecorator,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import * as config from 'config';

export const GetUserFromToken = createParamDecorator((data, context) => {
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
    console.log(decoded);

    // decoded 가 객체인지 확인한다. (string 일수도 있다고 함.)
    if (typeof decoded === 'object') {
      const decodedPayload = decoded as JwtPayload;
      return decodedPayload;
    }
  } catch (err) {
    // 에러를 로거에 출력하고 null 을 return 한다.
    Logger.error(err);
    return null;
  }
});
