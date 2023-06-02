import { DataSource, Repository } from 'typeorm';
import { Destination } from './entities/destination.entity';
import { Injectable } from '@nestjs/common';
import { CreateDestinationDto } from './dto/create-destination.dto';

@Injectable()
export class DestinationsRepository extends Repository<Destination> {
  constructor(private dataSource: DataSource) {
    super(Destination, dataSource.createEntityManager());
  }

  async insertDestinations(
    destinationsToInsert: CreateDestinationDto[],
  ): Promise<void> {
    console.log('@@@@@@@@@@@@@@@@@@@@@@');
    // console.log(destinationsToInsert);

    const promises = destinationsToInsert.map(async (destination) => {
      const data = await this.create(destination);
      await this.save(data);
    });

    await Promise.all(promises);
  }
}
