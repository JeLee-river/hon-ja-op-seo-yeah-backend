import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeORMConfig';
import { DestinationsModule } from './destinations/destinations.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeORMConfig), DestinationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
