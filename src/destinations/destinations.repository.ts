import { DataSource, In, Repository } from 'typeorm';
import { Destination } from './entities/destination.entity';
import { Injectable, Logger } from '@nestjs/common';
import { CreateDestinationDto } from './dto/create-destination.dto';

@Injectable()
export class DestinationsRepository extends Repository<Destination> {
  constructor(private dataSource: DataSource) {
    super(Destination, dataSource.createEntityManager());
  }

  async insertDestinations(
    destinationsToInsert: CreateDestinationDto[],
  ): Promise<void> {
    const promises = destinationsToInsert.map(async (destination) => {
      const data = await this.create(destination);
      await this.save(data);
    });

    const result = await Promise.allSettled(promises);
    Logger.log(result);
  }

  async getAllDestinations(): Promise<Destination[]> {
    const destinations = await this.find();
    return destinations;
  }

  async getDestinationsByCategoryIds(
    categoryIds: number[],
  ): Promise<{ totalCount: number; result: Destination[] }> {
    const destinations = await this.find({
      where: {
        category_id: In(categoryIds),
      },
    });
    const destinationsCount = destinations.length;

    return {
      totalCount: destinationsCount,
      result: destinations,
    };
  }

  async getDestination(destinationId: number): Promise<Destination> {
    const destination = await this.findOne({
      where: {
        id: destinationId,
      },
    });

    return destination;
  }

  async getDestinationsRanking(count: number): Promise<Destination[]> {
    // TODO : 추후에 '좋아요' 순으로 정렬하여 조회해야 한다.
    const destinations = await this.find({
      take: count,
    });

    return destinations;
  }
}
