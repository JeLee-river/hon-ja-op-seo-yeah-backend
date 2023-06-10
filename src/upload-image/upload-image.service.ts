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

  updateUserProfileImage(userId: string, path: string) {
    const domain = config.get('server').domain;
    const img = path.split('public')[1];
    const imagePath = domain + img;

    return this.usersRepository.saveUserProfileImagePath(userId, imagePath);
  }
}
