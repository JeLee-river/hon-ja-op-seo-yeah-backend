import { Controller, Get, Param } from '@nestjs/common';
import { DestinationsService } from './destinations.service';
import { Destination } from './entities/destination.entity';

@Controller()
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Get('/fetchData')
  async fetchData(): Promise<void> {
    return await this.destinationsService.fetchData();
  }

  @Get('/destinations')
  getAllDestinations(): Promise<Destination[]> {
    return this.destinationsService.getAllDestinations();
  }

  @Get('/categories/:categoryId/destinations')
  getDestinationsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<Destination[]> {
    return this.destinationsService.getDestinationsByCategory(categoryId);
  }
}
