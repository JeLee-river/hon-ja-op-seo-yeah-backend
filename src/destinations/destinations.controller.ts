import { Controller, Get } from '@nestjs/common';
import { DestinationsService } from './destinations.service';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get('/fetchData')
  async fetchData(): Promise<void> {
    return await this.destinationsService.fetchData();
  }
}
