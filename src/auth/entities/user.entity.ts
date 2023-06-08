import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { DestinationsComment } from '../../destinations_comments/entities/destinations-comment.entity';

@Entity()
// @Unique(['id', 'nickname'])
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

  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules: Schedule[];

  @OneToMany(
    () => DestinationsComment,
    (destinationsComment) => destinationsComment.user,
  )
  destination_comments: DestinationsComment[];
}
