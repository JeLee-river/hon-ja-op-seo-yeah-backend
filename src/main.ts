import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger/setupSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  // Swagger 설정
  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
