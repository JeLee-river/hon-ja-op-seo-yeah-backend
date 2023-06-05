import { ApiProperty } from '@nestjs/swagger';
import { Destination } from '../../destinations/entities/destination.entity';

export class DestinationResponse {
  @ApiProperty({ type: [Destination] })
  destinations: Destination[];
}
