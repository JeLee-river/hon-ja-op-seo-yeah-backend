import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ScheduleDetail } from '../../schedules/entities/schedule-detail.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Destination {
  @ApiProperty({ description: '여행지 ID', example: 1 })
  @PrimaryColumn()
  id: number;

  @ApiProperty({ description: '카테고리 ID', example: '12' })
  @Column()
  category_id: string;

  @ApiProperty({ description: '여행지명', example: '감낭오름' })
  @Column()
  title: string;

  @ApiProperty({
    description: '홈페이지',
    example:
      '제주 문화관광 <a href="http://www.visitjeju.net/" target="_blank" title="새창 : 제주 문화관광 사이트로 이동">http://www.visitjeju.net/</a>',
  })
  @Column()
  homepage: string;

  @ApiProperty({ description: '전화번호', example: '064-732-9886' })
  @Column()
  tel: string;

  @ApiProperty({
    description: '대표 이미지 1',
    example:
      'http://tong.visitkorea.or.kr/cms/resource/77/2666377_image2_1.jpg',
  })
  @Column()
  image1: string;

  @ApiProperty({
    description: '대표 이미지 2',
    example:
      'http://tong.visitkorea.or.kr/cms/resource/47/2755047_image2_1.jpg',
  })
  @Column()
  image2: string;

  @ApiProperty({
    description: '주소',
    example: '제주특별자치도 서귀포시 안덕면 평화로',
  })
  @Column()
  addr1: string;

  @ApiProperty({ description: '상세 주소', example: '(동광리)' })
  @Column()
  addr2: string;

  @ApiProperty({ description: '우편번호', example: '63524' })
  @Column()
  zipcode: string;

  @ApiProperty({ description: '지도 X좌표', example: '126.3457009272' })
  @Column()
  mapx: string;

  @Column()
  @ApiProperty({ description: '지도 Y좌표', example: '126.3457009272' })
  mapy: string;

  @ApiProperty({
    description: '개요',
    example: '오름기슭자락으로 원수악과 연결되어 있다.',
  })
  @Column()
  overview: string;

  @OneToMany(
    () => ScheduleDetail,
    (schedule_detail) => schedule_detail.destination,
  )
  schedule_details: ScheduleDetail[];
}
