import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

import { Response } from 'express';

import { SelfLikeException } from './self-like.exception';

@Catch(SelfLikeException)
export class SelfLikeExceptionFilter implements ExceptionFilter {
  catch(exception: SelfLikeException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(403).json({
      statusCode: 403,
      message: exception.message,
      error: 'Forbidden',
      timestamp: new Date().toISOString(),
    });
  }
}
