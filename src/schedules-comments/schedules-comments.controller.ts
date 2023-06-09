import { Controller } from '@nestjs/common';
import { SchedulesCommentsService } from './schedules-comments.service';

@Controller()
export class SchedulesCommentsController {
  constructor(
    private readonly schedulesCommentsService: SchedulesCommentsService,
  ) {}
}
