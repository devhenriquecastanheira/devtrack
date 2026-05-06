import { api } from './api';
import type { Track, TrackStatus } from '../types/track';

export type CreateTrackRequest = {
  title: string;
  description: string;
  status: TrackStatus;
};

export async function getTracks() {
  const response = await api.get<Track[]>('/tracks/');
  return response.data;
}

export async function createTrack(data: CreateTrackRequest) {
  const response = await api.post<Track>('/tracks/', data);
  return response.data;
}