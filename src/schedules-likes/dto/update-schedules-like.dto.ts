import { PartialType } from '@nestjs/swagger';
import { CreateSchedulesLikeDto } from './create-schedules-like.dto';

export class UpdateSchedulesLikeDto extends PartialType(CreateSchedulesLikeDto) {}
