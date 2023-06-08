import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeORMConfig';
import { DestinationsModule } from './destinations/destinations.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { SchedulesModule } from './schedules/schedules.module';
import { LoggerMiddleware } from './utils/logger/logger.middleware';
import { DestinationsCommentsModule } from './destinations-comments/destinations-comments.module';
import { DestinationsLikesModule } from './destinations-likes/destinations-likes.module';
import { SchedulesLikesModule } from './schedules-likes/schedules-likes.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
