import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDestinationsCommentDto {
  @IsString()
  @IsNotEmpty()
  comment: string;
}
