import { NestFactory } from '@nestjs/core';

import * as dotenv from 'dotenv';
import * as path from 'path';

import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';

import { setupSwagger } from './utils/swagger/setupSwagger';

import { winstonLogger } from './utils/logger/winston.util';

dotenv.config({
  path: path.resolve('.env'),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });

  app.setGlobalPrefix('/api');

  // Swagger 설정
  setupSwagger(app);

  // CORS 설정
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
