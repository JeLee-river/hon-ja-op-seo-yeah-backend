export interface ScheduleWithLikesAndComments {
  schedule_id: number;
  title: string;
  summary: string;
  duration: number;
  start_date: string | Date;
  end_date: string | Date;
  status: 'PUBLIC' | 'PRIVATE';
  image: string;
  created_at: Date;
  updated_at: Date;
  user: User;
  schedules_comments: SchedulesComment[];
  comments_count: number;
  likes_count: number;
  likes: Like[];
  first_destination: string;
  last_destination: string;
  destination_count: number;
  destinationIds: number[][];
  destinations: string[][];
  destinationMaps: DestinationMap[];
}

interface User {
  id: string;
  nickname: string;
  phone_number: string;
  profile_image: string;
}

interface SchedulesComment {
  comment_id: number;
  comment: string;
  created_at: Date;
  updated_at: Date;
  user: User;
}

interface Like {
  id: string;
  nickname: string;
  profile_image: string;
}

interface DestinationMap {
  id: number;
  title: string;
  mapx: string;
  mapy: string;
}
