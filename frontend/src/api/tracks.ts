import { api } from './api';
import type { Track, TrackStatus } from '../types/track';

export type SaveTrackRequest = {
  title: string;
  description: string;
  status: TrackStatus;
};

export type GetTracksParams = {
  search?: string;
  status?: string;
  ordering?: string;
};

export async function getTracks(params?: GetTracksParams) {
  const response = await api.get<Track[]>('/tracks/', {
    params,
  });

  return response.data;
}

export async function getTrackById(id: number) {
  const response = await api.get<Track>(`/tracks/${id}/`);
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