import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ScheduleDetail } from './schedule-detail.entity';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  schedule_id: number;

  @Column()
  user_id: string;

  @Column()
  title: string;

  @Column()
  summary: string;

  @Column()
  duration: number;

  @Column()
  start_date: string;

  @Column()
  end_date: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(
    (type) => ScheduleDetail,
    (schedule_detail) => schedule_detail.schedule,
  )
  schedule_details: ScheduleDetail[];

  @ManyToOne(() => User, (user) => user.schedules)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
