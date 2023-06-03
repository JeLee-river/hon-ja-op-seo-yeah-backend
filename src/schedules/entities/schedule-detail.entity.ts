import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ScheduleDetail {
  @PrimaryGeneratedColumn()
  idx: number; // Entity 에 PrimaryColumn 이 필수이기 때문에 생성한 컬럼.

  @Column()
  schedule_id: number;

  @Column()
  destination_id: number;

  @Column()
  day: string;

  @Column()
  tour_order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
