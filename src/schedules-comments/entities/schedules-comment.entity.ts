import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity()
export class SchedulesComment {
  @PrimaryGeneratedColumn()
  comment_id: number;

  @Column()
  schedule_id: number;

  @Column()
  user_id: string;

  @Column()
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 한 유저는 여행 일정에 여러 댓글을 남길 수 있다.
  @ManyToOne(() => User, (user) => user.schedules_comments)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  // 하나의 여행 일정는 여러 댓글이 남을 수 있다.
  @ManyToOne(() => Schedule, (schedule) => schedule.schedules_comments)
  @JoinColumn({ name: 'schedule_id', referencedColumnName: 'schedule_id' })
  schedule: Schedule;
}
