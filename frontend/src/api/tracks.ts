import { api } from './api';
import type { Track } from '../types/track';

export async function getTracks() {
  const response = await api.get<Track[]>('/tracks/');
  return response.data;
}