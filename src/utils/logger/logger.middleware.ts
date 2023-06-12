import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    // 요청 객체로부터 ip, http method, url, user agent 를 받아온 후
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent');

    // 응답이 끝나는 이벤트가 발생하면 로그를 찍는다.
    response.on('finish', () => {
      const { statusCode } = response;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${ip} ${userAgent}`,
      );
    });

    next();
  }
}
