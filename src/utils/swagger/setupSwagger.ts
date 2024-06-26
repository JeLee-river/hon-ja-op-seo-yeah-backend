import { INestApplication } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Swagger 설정
 *
 * @param app
 */
export function setupSwagger(app: INestApplication): void {
  // Swagger 설정 등록
  const config = new DocumentBuilder()
    .setTitle('Project - 혼자옵서예')
    .setDescription('혼자옵서예 프로젝트를 위한 API 문서입니다.')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '여기에 AccessToken 을 입력하세요.',
      },
      'access-token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: '여기에 RefreshToken 을 입력하세요.',
      },
      'refresh-token',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
}
