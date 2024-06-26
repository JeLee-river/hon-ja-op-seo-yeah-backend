import { Controller, Get } from '@nestjs/common';

import { ApiExcludeEndpoint } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiExcludeEndpoint() // Swagger 에서 제외하는 데코레이터
  getHello(): string {
    return this.appService.getHello();
  }
}
