import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DestinationsComment {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  destination_id: number;

  @Column()
  user_id: string;

  @Column()
  comment: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
