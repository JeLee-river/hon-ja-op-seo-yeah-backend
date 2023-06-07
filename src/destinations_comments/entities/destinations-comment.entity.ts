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

@Entity()
export class DestinationsComment {
  @PrimaryGeneratedColumn()
  comment_id: number;

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

  @ManyToOne(() => User, (user) => user.destinations_comments)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
