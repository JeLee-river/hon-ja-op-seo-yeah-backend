import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column()
  image: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
