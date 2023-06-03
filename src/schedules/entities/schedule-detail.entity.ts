import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Schedule } from './schedule.entity';
import { Destination } from '../../destinations/entities/destination.entity';

@Entity()
export class ScheduleDetail {
  @PrimaryGeneratedColumn()
  idx: number; // Entity 에 PrimaryColumn 이 필수이기 때문에 생성한 컬럼.

  @Column()
  schedule_id: number;

  @Column()
  destination_id: number;

  @Column()
  day: number;

  @Column()
  tour_order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne((type) => Schedule, (schedule) => schedule.schedule_details)
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  @ManyToOne(() => Destination, (destination) => destination.schedule_details)
  @JoinColumn({ name: 'destination_id' })
  destination: Destination;
}
