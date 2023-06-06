import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Schedule } from '../../schedules/entities/schedule.entity';

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

  @Column()
  profile_image: string;

  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules: Schedule[];
}
