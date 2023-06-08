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
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity()
export class SchedulesLike {
  @ApiProperty({ description: '순번', example: 20 })
  @PrimaryGeneratedColumn()
  idx: number;

  @ApiProperty({ description: '[좋아요] 대상 여행 일정 ID', example: 15 })
  @Column()
  schedule_id: number;

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

  // 한 유저(One)는 여러 일정에 좋아요(Many) 할 수 있다.
  // -> 현재 엔티티는 좋아요(Many)이고, 유저와 연결하면 To One
  @ManyToOne(() => User, (user) => user.schedules_likes)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  // 하나의 일정(One)에 대해 여러 개의 좋아요(Many)가 생성된다.
  // -> 현재 엔티티는 좋아요(Many)이고, 일정과 연결하면 To One
  @ManyToOne(() => Schedule, (schedule) => schedule.schedules_likes)
  @JoinColumn({ name: 'schedule_id', referencedColumnName: 'schedule_id' })
  schedule: Schedule;
}
