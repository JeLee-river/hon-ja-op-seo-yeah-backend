export class SelfLikeException extends Error {
  constructor() {
    super('자신의 여행 일정에는 [좋아요] 할 수 없습니다.');
    this.name = 'SelfLikeException';
  }
}
