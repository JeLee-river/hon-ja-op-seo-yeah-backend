import { Injectable } from '@nestjs/common';

import { UsersRepository } from '../auth/users.repository';
import { SchedulesRepository } from '../schedules/schedules.repository';

import dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class UploadImageService {
  constructor(
    private usersRepository: UsersRepository,
    private schedulesRepository: SchedulesRepository,
  ) {}

  createImagePath(path: string): string {
    const domain = process.env.SERVER_DOMAIN;
    const img = path.split('public')[1];
    return domain + img;
  }

  async uploadUserProfileImage(
    path: string,
  ): Promise<{ message: string; imagePath: string }> {
    const imagePath = this.createImagePath(path);

    return {
      message: '프로필 이미지가 성공적으로 업로드 되었습니다.',
      imagePath,
    };
  }

  async uploadScheduleBackgroundImage(
    path: string,
  ): Promise<{ message: string; imagePath: string }> {
    // TODO: 현재 일정이 존재하는지, 로그인 유저가 작성자인지 확인 필요

    const imagePath = this.createImagePath(path);

    return {
      message: '여행 일정 배경 이미지가 성공적으로 업로드 되었습니다.',
      imagePath,
    };
  }
}
