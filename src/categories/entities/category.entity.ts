import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Destination } from '../../destinations/entities/destination.entity';

@Entity()
export class Category {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => Destination, (destination) => destination.category)
  destinations: Destination[];
}
