export interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  location: string;
  photo?: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

export interface EventParticipation {
[x: string]: any;
  id: number;
  user_id: number;
  event_id: number;
  registration_date: string;
}
