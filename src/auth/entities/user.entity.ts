import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
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
}
