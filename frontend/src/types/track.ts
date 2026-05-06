export type TrackStatus = 'not_started' | 'in_progress' | 'completed';

export type Topic = {
  id: number;
  track: number;
  track_title: string;
  title: string;
  description: string;
  completed: boolean;
  order: number;
  created_at: string;
  updated_at: string;
};

export type Track = {
  id: number;
  title: string;
  description: string;
  status: TrackStatus;
  topics: Topic[];
  created_at: string;
  updated_at: string;
};