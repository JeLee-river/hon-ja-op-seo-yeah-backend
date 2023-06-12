import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { DestinationsComment } from '../../destinations-comments/entities/destinations-comment.entity';
import { DestinationsLike } from '../../destinations-likes/entities/destinations-like.entity';
import { SchedulesLike } from '../../schedules-likes/entities/schedules-like.entity';
import { SchedulesComment } from '../../schedules-comments/entities/schedules-comment.entity';

@Entity()
@Unique(['id'])
@Unique(['nickname'])
export class User {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  id: string;

  @Column()
  password: string;

  @Column()
  nickname: string;

  @Column()
  birth_date: string;

  @Column()
  phone_number: string;

  @Column()
  gender: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  profile_image: string;

  @Column({ nullable: true })
  refresh_token: string;

  // 하나의 유저는 여러 일정을 생성할 수 있다.
  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules: Schedule[];

  // 하나의 유저는 여행지 댓글을 여러 개 생성할 수 있다.
  @OneToMany(
    () => DestinationsComment,
    (destinationsComment) => destinationsComment.user,
  )
  destination_comments: DestinationsComment[];

  // 하나의 유저는 여행지 댓글을 여러 개 생성할 수 있다.
  @OneToMany(
    () => SchedulesComment,
    (schedulesComment) => schedulesComment.user,
  )
  schedules_comments: SchedulesComment[];

  // 하나의 유저는 여러 여행지에 좋아요 할 수 있다.
  @OneToMany(
    () => DestinationsLike,
    (destinationsLike) => destinationsLike.user,
  )
  destination_likes: DestinationsLike[];

  // 하나의 유저는 여러 일정에 좋아요 할 수 있다.
  @OneToMany(() => SchedulesLike, (schedulesLike) => schedulesLike.user)
  schedules_likes: SchedulesLike[];
}
