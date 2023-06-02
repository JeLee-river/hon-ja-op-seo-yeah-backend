import { Controller, Get } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { Destination } from './entities/destination.entity';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get('/fetchData')
  async fetchData(): Promise<void> {
    return await this.destinationsService.fetchData();
  }

  @Get()
  getAllDestinations(): Promise<Destination[]> {
    return this.destinationsService.getAllDestinations();
  }
}
