import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../auth/entities/user.entity';
import { Destination } from '../../destinations/entities/destination.entity';

@Entity()
export class DestinationsLike {
  @PrimaryGeneratedColumn()
  idx: number;

  @ApiProperty({ description: '[좋아요] 대상 여행지 ID', example: 2877795 })
  @Column()
  destination_id: number;

  @ApiProperty({
    description: '[좋아요] 한 사용자 아이디',
    example: '0hee@example.com',
  })
  @Column()
  user_id: string;

  @ApiProperty({ description: '[좋아요] 여부 (true or false)', example: true })
  @Column()
  is_liked: boolean;

  @ApiProperty({
    description: '처음 [좋아요] 한 날짜 ',
    example: '2023-06-08T03:24:41.985Z',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    description: '마지막으로 [좋아요] 설정/해제한 날짜',
    example: '2023-06-08T04:03:34.616Z',
  })
  @UpdateDateColumn()
  updated_at: Date;

  // 한 유저는 여러 여행지를 좋아요 할 수 있다.
  @ManyToOne(() => User, (user) => user.destination_likes)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  // 하나의 목적지에 대해 여러 개의 좋아요가 생성된다.
  @ManyToOne(() => Destination, (destination) => destination.destination_likes)
  @JoinColumn({ name: 'destination_id', referencedColumnName: 'id' })
  destination: Destination;
}
