import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUserFromAccessToken } from '../auth/get-user-from-access-token.decorator';

@ApiTags('이미지 업로드 (upload)')
@Controller('upload')
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService) {}

  @Post('/profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '프로필 이미지를 업로드합니다.',
    description: '프로필 이미지를 업로드합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 프로필 이미지를 선택합니다.',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: '프로필 이미지 경로' })
  updateProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @GetUserFromAccessToken() user,
  ): Promise<{ message: string; imagePath: string }> {
    const { path } = file;

    return this.uploadImageService.updateUserProfileImage(user.id, path);
  }

  @Post('/schedules/:scheduleId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '여행 일정 배경 이미지를 업로드합니다.',
    description: '여행 일정 배경 이미지를 업로드합니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 여행 일정 배경 이미지를 선택합니다.',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: '여행 일정 배경 이미지 경로' })
  updateScheduleBackgroundImage(
    @UploadedFile() file: Express.Multer.File,
    @GetUserFromAccessToken() user,
    @Param('scheduleId', ParseIntPipe) schedule_id: number,
  ): Promise<{ message: string; imagePath: string }> {
    const { path } = file;

    return this.uploadImageService.updateScheduleBackgroundImage(
      schedule_id,
      user.id,
      path,
    );
  }
}
