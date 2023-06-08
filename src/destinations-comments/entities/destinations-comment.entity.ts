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
import { Destination } from '../../destinations/entities/destination.entity';

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

  // 한 유저는 여러 여행지 댓글을 남길 수 있다.
  @ManyToOne(() => User, (user) => user.destination_comments)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  // 한 여행지에는 여러 댓글이 남을 수 있다.
  @ManyToOne(
    () => Destination,
    (destination) => destination.destination_comments,
  )
  @JoinColumn({ name: 'destination_id', referencedColumnName: 'id' })
  destination: Destination;
}
