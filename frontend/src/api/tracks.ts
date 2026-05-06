import { api } from './api';
import type { Track, TrackStatus } from '../types/track';

export type SaveTrackRequest = {
  title: string;
  description: string;
  status: TrackStatus;
};

export async function getTracks() {
  const response = await api.get<Track[]>('/tracks/');
  return response.data;
}

export async function createTrack(data: SaveTrackRequest) {
  const response = await api.post<Track>('/tracks/', data);
  return response.data;
}

export async function updateTrack(id: number, data: SaveTrackRequest) {
  const response = await api.put<Track>(`/tracks/${id}/`, data);
  return response.data;
}

export async function deleteTrack(id: number) {
  await api.delete(`/tracks/${id}/`);
}