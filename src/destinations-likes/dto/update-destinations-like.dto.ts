import { PartialType } from '@nestjs/swagger';
import { CreateDestinationsLikeDto } from './create-destinations-like.dto';

export class UpdateDestinationsLikeDto extends PartialType(CreateDestinationsLikeDto) {}
