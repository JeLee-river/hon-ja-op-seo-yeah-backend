import { HttpException, Logger, Module } from '@nestjs/common';

import { MulterModule } from '@nestjs/platform-express';

import { UploadImageController } from './upload-image.controller';
import { UploadImageService } from './upload-image.service';

import { AuthModule } from '../auth/auth.module';
import { SchedulesModule } from '../schedules/schedules.module';

import { UsersRepository } from '../auth/users.repository';
import { SchedulesRepository } from '../schedules/schedules.repository';

import { diskStorage } from 'multer';

import * as mime from 'mime-types';
import { existsSync, mkdirSync } from 'fs';

@Module({
  imports: [
    AuthModule,
    SchedulesModule,
    MulterModule.register({
      storage: diskStorage({
        destination(req, file, callback) {
          try {
            // callback 함수의 두번째 인자로 파일 저장 경로를 지정할 수 있다.
            Logger.log(file);
            const path = 'public/img';
            if (!existsSync(path)) {
              mkdirSync(path);
            }

            callback(null, path);
          } catch (error) {
            callback(error, null);
            Logger.error(error);
          }
        },
        filename(req, file, callback) {
          // callback 함수의 두번째 인자로 파일명을 지정할 수 있다.
          callback(
            null,
            `${new Date().getTime()}.${mime.extension(file.mimetype)}`,
          );
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB 로 파일 크기을 제한한다. 올바른 요청이 아니면 413 상태 코드를 return 한다.
        files: 1,
      },
      fileFilter(req, file, callback) {
        // limits 에서 파일 사이즈 등 검증 후에 파일 타입에 대한 검증을 진행한다.
        // 검증 진행 후 정상 요청이면 callback 의 두 번째 인자로 true 를 넣는다.
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/i)) {
          // 이미지 형식은 jpg, jpeg, png만 허용합니다.
          callback(null, true);
        } else {
          callback(
            new HttpException(
              '지원하지 않는 이미지 형식입니다. jpg, jpeg, png 파일만 가능합니다.',
              415,
            ),
            false,
          );
        }
      },
    }),
  ],
  controllers: [UploadImageController],
  providers: [UploadImageService, UsersRepository, SchedulesRepository],
})
export class UploadImageModule {}
