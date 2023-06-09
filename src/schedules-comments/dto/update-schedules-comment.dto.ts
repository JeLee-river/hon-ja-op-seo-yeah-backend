import { PartialType } from '@nestjs/swagger';
import { CreateSchedulesCommentDto } from './create-schedules-comment.dto';

export class UpdateSchedulesCommentDto extends PartialType(CreateSchedulesCommentDto) {}
