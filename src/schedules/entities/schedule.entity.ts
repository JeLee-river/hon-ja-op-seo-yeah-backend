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
import { ScheduleStatus } from '../../types/ScheduleStatus.enum';
import { SchedulesLike } from '../../schedules-likes/entities/schedules-like.entity';
import { SchedulesComment } from '../../schedules-comments/entities/schedules-comment.entity';

import * as config from 'config';

const defaultImagePath = config.get('img').DEFAULT_BACKGROUND_IMG_PATH;

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

  @Column({ default: 'PUBLIC' })
  status: ScheduleStatus;

  @Column({
    default: defaultImagePath,
    nullable: true,
  })
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

  // 한 명의 유저가(One) 가 여러 일정(Schedule) 을 만들 수 있다.
  // 현재 엔티티가 일정이므로 Many, 유저랑 연결하면 To One
  @ManyToOne(() => User, (user) => user.schedules)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  // 하나의 일정(One)에 여러 좋아요(Many)가 올 수 있다.
  // 현재 엔티티가 일정이므로 One, 좋아요와 연결하면 To Many
  @OneToMany(() => SchedulesLike, (schedulesLike) => schedulesLike.schedule)
  @JoinColumn({ name: 'schedule_id', referencedColumnName: 'schedule_id' })
  schedules_likes: SchedulesLike[];

  // 하나의 일정(One)에 여러 댓글(Many)이 작성될 수 수 있다.
  // 현재 엔티티가 일정이므로 One, 댓글과 연결하면 To Many
  @OneToMany(
    () => SchedulesComment,
    (schedulesComment) => schedulesComment.schedule,
  )
  @JoinColumn({ name: 'schedule_id', referencedColumnName: 'schedule_id' })
  schedules_comments: SchedulesComment[];
}
