import { Destination } from '../destinations/entities/destination.entity';

export interface ResponseScheduleInterface {
  schedule_id: number;
  title: string;
  summary: string;
  duration: number;
  start_date: string;
  end_date: string;
  status: string;
  image: string;
  created_at: Date;
  user: {
    id: string;
    nickname: string;
    phone_number: string;
    profile_image: string;
  };
  schedule_details: iSchedule_details[];
  destinations: string[][];
  first_destination: string;
  last_destination: string;
  destination_count: number;
}

interface iSchedule_details {
  idx: number;
  schedule_id: number;
  destination_id: number;
  day: number;
  tour_order: number;
  created_at: Date;
  updated_at: Date;
  destination: Destination;
}
