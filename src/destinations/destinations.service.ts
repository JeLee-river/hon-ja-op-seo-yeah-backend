import { Injectable } from '@nestjs/common';
import { DestinationsRepository } from './destinations.repository';
import { Destination } from './entities/destination.entity';
import { CreateDestinationDto } from './dto/create-destination.dto';

@Injectable()
export class DestinationsService {
  constructor(private destinationsRepository: DestinationsRepository) {}

  async fetchData(): Promise<void> {
    // TODO: serviceKey 등 주요 정보를 .env 파일로 분리
    const baseUrl =
      'https://apis.data.go.kr/B551011/KorService1/areaBasedList1';
    const serviceKey =
      'gYxeW4UBcFMVnEbeclSlXiybRNht4DCVRd5g7YeF8ippmVNRo9bc1rwDyu%2Fz8OT7yVPSy0%2BrLZ3LtaDUsIHrvg%3D%3D';
    const numOfRows = '1000';
    const pageNo = '1';
    const mobileOS = 'ETC';
    const mobileApp = 'AppTest';
    const _type = 'json';
    const listYN = 'Y';
    const arrange = 'A';
    const areaCode = '39';

    const url = `${baseUrl}?serviceKey=${serviceKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&MobileOS=${mobileOS}&MobileApp=${mobileApp}&_type=${_type}&listYN=${listYN}&arrange=${arrange}&areaCode=${areaCode}`;

    try {
      const response = await fetch(url);
      const result = await response.json();
      const data = result.response.body.items.item;
      // console.log(data);

      await this.fetchDataIncludesOverview(data);
    } catch (e) {
      console.log(e);
    }
  }

  async fetchDataIncludesOverview(data): Promise<void> {
    // TODO: fetch 한 데이터의 프로퍼티들을 모두 포함하는 interface 또는 type 을 하나 만들어야할지?
    const destinations: any[] = [];

    const promises = data.map(async ({ contentid }) => {
      // console.log(`contentid: ${contentid}`);

      // TODO: API 호출 건수는 2,000건으로 제한되어있으므로, 데이터 범위를 나누어서 여러 일에 걸쳐서 데이터를 호출하여 가져와야한다.
      // TODO: ex. 총 2,350건이라면 하루는 2,000건, 다음날에 350건...
      const url = `https://apis.data.go.kr/B551011/KorService1/detailCommon1?serviceKey=gYxeW4UBcFMVnEbeclSlXiybRNht4DCVRd5g7YeF8ippmVNRo9bc1rwDyu%2Fz8OT7yVPSy0%2BrLZ3LtaDUsIHrvg%3D%3D&MobileOS=ETC&MobileApp=AppTest&_type=json&contentId=${contentid}&defaultYN=Y&firstImageYN=Y&addrinfoYN=Y&mapinfoYN=Y&overviewYN=Y&numOfRows=10&pageNo=1`;

      const response = await fetch(url);
      const result = await response.json();

      // TODO: 응답이 데이터 객체 1개인데도 배열에 담겨져서 넘어오는 경우 : 이렇게 [0] 으로 인덱싱 처리해도 괜찮은가?
      const data = result.response.body.items.item[0];

      destinations.push(data);
    });

    try {
      await Promise.all(promises);

      await this.insertDestinations(destinations);
    } catch (e) {
      console.log(e);
    }
  }

  async insertDestinations(destinations: any[]): Promise<void> {
    // TODO : 테이블에 insert 하지 않을 property 를 제외해야 한다.
    const destinationsToInsert: CreateDestinationDto[] = destinations.map(
      (data) => {
        return {
          id: data.contentid,
          category_id: data.contenttypeid,
          title: data.title,
          homepage: data.homepage,
          tel: data.tel,
          image1: data.firstimage,
          image2: data.firstimage2,
          addr1: data.addr1,
          addr2: data.addr2,
          zipcode: data.zipcode,
          mapx: data.mapx,
          mapy: data.mapy,
          overview: data.overview,
        };
      },
    );

    try {
      await this.destinationsRepository.insertDestinations(
        destinationsToInsert,
      );
    } catch (e) {
      console.log(e);
    }
  }
}
