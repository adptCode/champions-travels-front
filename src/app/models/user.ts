export interface User {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  city?: string;
  country?: string;
  email: string;
  password: string;
  profile_picture?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
  preferences?: string[];
}

export interface Preference {
  id: number;
  user_id: number;
  team_name: string;
}

export interface EventParticipation {
  id: number;
  user_id: number;
  event_id: number;
  registration_date: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
