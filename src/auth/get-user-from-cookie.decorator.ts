import { createParamDecorator, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import * as config from 'config';

export const GetUserFromCookie = createParamDecorator((data, context) => {
  const request = context.switchToHttp().getRequest();
  const accessToken = request.cookies['jwt'];

  try {
    const decoded = jwt.verify(
      accessToken,
      config.get('jwt.JWT_ACCESS_TOKEN_SECRET'),
    );
    console.log(decoded);

    // decoded 가 객체인지 확인한다. (string 일수도 있다고 함.)
    if (typeof decoded === 'object') {
      const decodedPayload = decoded as JwtPayload;
      return decodedPayload;
    } else {
      // id 가 없을 경우 에러를 반환한다.
      throw new Error('No id present in the decoded token.');
    }
  } catch (err) {
    // 에러를 로거에 출력하고 null 을 return 한다.
    Logger.error(err);
    return null;
  }
});
