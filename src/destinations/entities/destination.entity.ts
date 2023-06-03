import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ScheduleDetail } from '../../schedules/entities/schedule-detail.entity';

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

  @OneToMany(
    () => ScheduleDetail,
    (schedule_detail) => schedule_detail.destination,
  )
  schedule_details: ScheduleDetail[];
}
