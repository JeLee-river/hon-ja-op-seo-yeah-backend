import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeORMConfig';
import { DestinationsModule } from './destinations/destinations.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { SchedulesModule } from './schedules/schedules.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    DestinationsModule,
    CategoriesModule,
    AuthModule,
    SchedulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
