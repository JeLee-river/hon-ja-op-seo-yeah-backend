import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../auth/users.repository';
import { SchedulesRepository } from '../schedules/schedules.repository';
import * as config from 'config';

@Injectable()
export class UploadImageService {
  constructor(
    private usersRepository: UsersRepository,
    private schedulesRepository: SchedulesRepository,
  ) {}

  createImagePath(path: string): string {
    const domain = config.get('server').domain;
    const img = path.split('public')[1];
    return domain + img;
  }

  async updateUserProfileImage(
    userId: string,
    path: string,
  ): Promise<{ message: string; imagePath: string }> {
    const imagePath = this.createImagePath(path);

    const result = await this.usersRepository.saveUserProfileImagePath(
      userId,
      imagePath,
    );

    const COUNT_TO_BE_UPDATED = 1;
    if (result.affected < COUNT_TO_BE_UPDATED) {
      throw new InternalServerErrorException(
        '프로필 이미지 업로드에 실패했습니다. 관리자에게 문의하세요.',
      );
    }

    return {
      message: '프로필 이미지가 성공적으로 업로드 되었습니다.',
      imagePath,
    };
  }

  async updateScheduleBackgroundImage(
    schedule_id: number,
    user_id: string,
    path: string,
  ): Promise<{ message: string; imagePath: string }> {
    // 로그인 한 유저가 해당 일정의 작성자인지 확인한다.
    const scheduleToBeUpdated = await this.schedulesRepository.getScheduleById(
      schedule_id,
    );

    if (!scheduleToBeUpdated) {
      throw new NotFoundException('해당 여행 일정이 존재하지 않습니다.');
    }

    if (user_id !== scheduleToBeUpdated.user.id) {
      throw new UnauthorizedException('이미지를 업로드할 권한이 없습니다.');
    }

    const imagePath = this.createImagePath(path);
    const result = await this.schedulesRepository.updateScheduleBackgroundImage(
      schedule_id,
      imagePath,
    );

    const COUNT_TO_BE_UPDATED = 1;
    if (result.affected < COUNT_TO_BE_UPDATED) {
      throw new InternalServerErrorException(
        '여행 일정 배경 이미지 업로드에 실패했습니다. 관리자에게 문의하세요.',
      );
    }

    return {
      message: '여행 일정 배경 이미지가 성공적으로 업로드 되었습니다.',
      imagePath,
    };
  }
}
