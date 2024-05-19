import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { DestinationsModule } from './destinations/destinations.module';
import { DestinationsLikesModule } from './destinations-likes/destinations-likes.module';
import { DestinationsCommentsModule } from './destinations-comments/destinations-comments.module';
import { SchedulesModule } from './schedules/schedules.module';
import { SchedulesLikesModule } from './schedules-likes/schedules-likes.module';
import { SchedulesCommentsModule } from './schedules-comments/schedules-comments.module';
import { UploadImageModule } from './upload-image/upload-image.module';

import { join } from 'path';

import { LoggerMiddleware } from './utils/logger/logger.middleware';

import { typeORMConfig } from './configs/typeORMConfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    DestinationsModule,
    CategoriesModule,
    AuthModule,
    SchedulesModule,
    DestinationsCommentsModule,
    DestinationsLikesModule,
    SchedulesLikesModule,
    SchedulesCommentsModule,
    UploadImageModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
