import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data, context) => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
