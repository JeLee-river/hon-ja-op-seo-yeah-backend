import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Destination {
  @PrimaryColumn()
  id: number;

  @Column()
  category_id: string;

  @Column()
  title: string;

  @Column()
  homepage: string;

  @Column()
  tel: string;

  @Column()
  image1: string;

  @Column()
  image2: string;

  @Column()
  addr1: string;

  @Column()
  addr2: string;

  @Column()
  zipcode: string;

  @Column()
  mapx: string;

  @Column()
  mapy: string;

  @Column()
  overview: string;
}
