import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return file;
  }
}
