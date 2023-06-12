import { Injectable } from '@nestjs/common';
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

  async uploadUserProfileImage(
    userId: string,
    path: string,
  ): Promise<{ message: string; imagePath: string }> {
    const imagePath = this.createImagePath(path);

    return {
      message: '프로필 이미지가 성공적으로 업로드 되었습니다.',
      imagePath,
    };
  }

  async uploadScheduleBackgroundImage(
    schedule_id: number,
    user_id: string,
    path: string,
  ): Promise<{ message: string; imagePath: string }> {
    // TODO : 이 시점에 이미 파일은 업로드가 되어버리는 것 같다.
    // TODO : FileInterceptor 가 동작하기 전에 Guard 등으로 이 내용들을 체크해야 한다.

    // const scheduleToBeUpdated = await this.schedulesRepository.getScheduleById(
    //   schedule_id,
    // );
    //
    // if (!scheduleToBeUpdated) {
    //   throw new NotFoundException('해당 여행 일정이 존재하지 않습니다.');
    // }
    //
    // if (user_id !== scheduleToBeUpdated.user.id) {
    //   throw new UnauthorizedException('이미지를 업로드할 권한이 없습니다.');
    // }

    const imagePath = this.createImagePath(path);

    return {
      message: '여행 일정 배경 이미지가 성공적으로 업로드 되었습니다.',
      imagePath,
    };
  }
}
